import { GoogleGenAI } from '@google/genai';
import { calculateConsumptionMetrics, normalizeMonthlyHistory } from '../solar/consumption';
import { BillExtraction } from '../solar/types';
import { geminiBillExtractionSchema } from '../validators/solarAnalyzer.validator';
import {
  SolarAnalyzerError,
  validateSolarBillFile,
} from './solarAnalyzerFile.service';

const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';
const DEFAULT_GEMINI_TIMEOUT_MS = 30_000;

const EXTRACTION_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'provider', 'city', 'citySource', 'cityConfidence', 'currentMonth', 'monthlyHistory', 'connectionType', 'phase',
    'sanctionedLoadKw', 'connectedLoadKw', 'consumerCategory', 'currentBillAmount',
    'overallConfidence', 'warnings',
  ],
  properties: {
    provider: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    city: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    citySource: {
      anyOf: [
        {
          type: 'string',
          enum: [
            'customer-address',
            'explicit-installation-location',
            'provider-or-disco',
            'unknown',
          ],
        },
        { type: 'null' },
      ],
    },
    cityConfidence: {
      anyOf: [
        { type: 'string', enum: ['high', 'medium', 'low'] },
        { type: 'null' },
      ],
    },
    currentMonth: {
      type: 'object',
      additionalProperties: false,
      required: ['month', 'year', 'kwh'],
      properties: {
        month: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        year: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        kwh: { anyOf: [{ type: 'number' }, { type: 'null' }] },
      },
    },
    monthlyHistory: {
      type: 'array',
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['month', 'year', 'kwh', 'confidence'],
        properties: {
          month: { type: 'string' },
          year: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
          kwh: { anyOf: [{ type: 'number' }, { type: 'null' }] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
      },
    },
    connectionType: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    phase: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    sanctionedLoadKw: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    connectedLoadKw: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    consumerCategory: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    currentBillAmount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    overallConfidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    warnings: { type: 'array', items: { type: 'string' }, maxItems: 20 },
  },
};

const EXTRACTION_PROMPT = `You are reading a Pakistani electricity bill. Extract bill data only.

Rules:
- Never calculate or recommend any solar system, PV size, inverter, battery, ROI, or engineering design.
- Never invent missing or unreadable figures. Use null for unreadable scalar values.
- Never fabricate missing months. Return only months visibly present on the bill.
- Preserve the printed month/year association and interpret electricity units as kWh only when the bill context establishes that meaning.
- Mark uncertain monthly readings with medium or low confidence and explain uncertainty in warnings.
- Keep the electricity provider/DISCO in provider. A provider name, company headquarters, or service territory is never evidence of the customer's installation city.
- Set city only when a Pakistani city is explicitly printed in the customer address or an explicit installation/service location field and the city reading has high confidence. Otherwise set city to null.
- Set citySource to customer-address or explicit-installation-location only for that direct printed evidence. If the only location hint comes from the provider/DISCO, set citySource to provider-or-disco and city to null. Use unknown when the source cannot be established.
- Set cityConfidence to high only for a clear city in an accepted location field; otherwise use the observed confidence or null.
- Do not return customer name, address, reference number, account number, consumer ID, meter number, CNIC, phone, or any other personal identifier.
- Return only the requested structured JSON.`;

export type GeminiTextGenerator = (file: Express.Multer.File) => Promise<string>;

export function normalizeGeminiServiceError(
  error: any,
  aborted = false
): SolarAnalyzerError {
  if (error instanceof SolarAnalyzerError) return error;
  if (aborted || error?.name === 'AbortError') {
    return new SolarAnalyzerError(
      'Bill analysis timed out. Retry or enter consumption manually.',
      504,
      'GEMINI_TIMEOUT'
    );
  }
  if (error?.status === 429 || /rate limit|resource exhausted/i.test(error?.message || '')) {
    return new SolarAnalyzerError(
      'The bill analyzer is busy. Please retry shortly or enter usage manually.',
      503,
      'GEMINI_RATE_LIMITED'
    );
  }
  return new SolarAnalyzerError(
    'Bill extraction is temporarily unavailable. Retry or enter usage manually.',
    502,
    'GEMINI_UNAVAILABLE'
  );
}

export function parseGeminiBillExtraction(rawText: string): BillExtraction {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new SolarAnalyzerError(
      'The bill reader returned an invalid response. Please retry or enter usage manually.',
      502,
      'GEMINI_MALFORMED_RESPONSE'
    );
  }

  const result = geminiBillExtractionSchema.safeParse(parsed);
  if (!result.success) {
    throw new SolarAnalyzerError(
      'The bill reader could not validate the extracted data. Please retry or enter usage manually.',
      502,
      'GEMINI_INVALID_STRUCTURE'
    );
  }

  const acceptedCitySources = new Set([
    'customer-address',
    'explicit-installation-location',
  ]);
  const cityAccepted = Boolean(
    result.data.city &&
    result.data.cityConfidence === 'high' &&
    result.data.citySource &&
    acceptedCitySources.has(result.data.citySource)
  );

  if (cityAccepted) return result.data;

  return {
    ...result.data,
    city: null,
    cityConfidence: null,
    warnings: result.data.city
      ? [...result.data.warnings, 'Installation city requires user verification.']
      : result.data.warnings,
  };
}

async function generateGeminiExtraction(file: Express.Multer.File): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new SolarAnalyzerError(
      'Bill extraction is temporarily unavailable. Enter consumption manually.',
      503,
      'GEMINI_NOT_CONFIGURED'
    );
  }

  const configuredTimeout = Number(process.env.GEMINI_TIMEOUT_MS);
  const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_GEMINI_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
      contents: [
        { text: EXTRACTION_PROMPT },
        {
          inlineData: {
            mimeType: file.mimetype,
            data: file.buffer.toString('base64'),
          },
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: EXTRACTION_JSON_SCHEMA,
        temperature: 0,
        maxOutputTokens: 4096,
        abortSignal: controller.signal,
        httpOptions: { timeout: timeoutMs },
      },
    });

    if (!response.text) {
      throw new SolarAnalyzerError(
        'The bill could not be read clearly. Upload a clearer bill or enter usage manually.',
        422,
        'GEMINI_EMPTY_RESPONSE'
      );
    }

    return response.text;
  } catch (error: any) {
    throw normalizeGeminiServiceError(error, controller.signal.aborted);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function extractSolarBill(
  file: Express.Multer.File,
  generator: GeminiTextGenerator = generateGeminiExtraction
) {
  validateSolarBillFile(file);
  const extraction = parseGeminiBillExtraction(await generator(file));
  const normalizedHistory = normalizeMonthlyHistory(extraction.monthlyHistory);
  const metrics = calculateConsumptionMetrics(normalizedHistory);

  return {
    extraction,
    normalizedHistory,
    metrics,
  };
}
