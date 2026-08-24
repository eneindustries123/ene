import { Request, Response } from 'express';
import { SOLAR_ENGINEERING_CONFIG, SOLAR_MODEL_BASIS } from '../solar/config';
import { recommendSolarSystems } from '../solar/calculator';
import { SUPPORTED_PAKISTAN_CITIES } from '../solar/profiles';
import { extractSolarBill } from '../services/solarAnalyzerGemini.service';
import {
  getSolarAnalyzerMaxFileBytes,
  SolarAnalyzerError,
} from '../services/solarAnalyzerFile.service';
import { solarRecommendationSchema } from '../validators/solarAnalyzer.validator';

export class SolarAnalyzerController {
  static config(req: Request, res: Response) {
    return res.status(200).json({
      cities: SUPPORTED_PAKISTAN_CITIES,
      upload: {
        maxFileBytes: getSolarAnalyzerMaxFileBytes(),
        acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        acceptedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
      },
      engineering: {
        panelWattage: SOLAR_ENGINEERING_CONFIG.panelWattage,
        performanceRatio: SOLAR_ENGINEERING_CONFIG.performanceRatio,
        standardInverterSizesKw: SOLAR_ENGINEERING_CONFIG.standardInverterSizesKw,
        batteryModuleKwh: SOLAR_ENGINEERING_CONFIG.batteryModuleKwh,
        profileBasis: SOLAR_MODEL_BASIS,
      },
    });
  }

  static async extract(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        error: 'Select an electricity bill to analyze.',
        code: 'FILE_REQUIRED',
      });
    }

    try {
      const result = await extractSolarBill(req.file);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof SolarAnalyzerError) {
        return res.status(error.statusCode).json({ error: error.message, code: error.code });
      }
      return res.status(500).json({
        error: 'The bill could not be analyzed. Retry or enter usage manually.',
        code: 'BILL_ANALYSIS_FAILED',
      });
    }
  }

  static recommend(req: Request, res: Response) {
    const parsed = solarRecommendationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Verify all twelve monthly consumption values and the installation city.',
        code: 'INVALID_RECOMMENDATION_INPUT',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      return res.status(200).json(recommendSolarSystems(parsed.data));
    } catch {
      return res.status(400).json({
        error: 'A recommendation could not be calculated from the provided data.',
        code: 'RECOMMENDATION_FAILED',
      });
    }
  }
}
