'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';
import { apiFetchWithTimeout, getApiUrl } from '@/lib/api-client';
import {
  ANALYZER_MONTHS,
  AnalyzerConfidence,
  AnalyzerMonthKey,
  AnalyzerSystemRecommendation,
  buildAnalyzerQuoteUrl,
  buildAnalyzerWhatsAppMessage,
  calculateAnalyzerMetrics,
  createEmptyMonthlyValues,
  ExtractionResponse,
  formatBatteryRange,
  monthlyValuesFromExtraction,
  SolarRecommendationResponse,
  validateAnalyzerBillFile,
} from '@/lib/solar-analyzer';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

type AnalyzerStep = 'upload' | 'verify' | 'results';
type BackupLevel = 'essential' | 'most' | 'entire';

const PAKISTAN_CITIES = [
  'Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Faisalabad',
  'Multan', 'Hyderabad', 'Quetta', 'Gujranwala', 'Sialkot', 'Bahawalpur',
  'Abbottabad', 'Mardan', 'Sukkur',
];

const CONFIDENCE_STYLES: Record<AnalyzerConfidence, string> = {
  high: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  low: 'text-rose-700 bg-rose-50 border-rose-200',
};

function formatNumber(value: number, digits = 0) {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function SystemCard({
  system,
  best,
}: {
  system: AnalyzerSystemRecommendation;
  best?: boolean;
}) {
  return (
    <div className={`rounded-3xl border p-6 flex flex-col gap-5 ${
      best
        ? 'bg-solix-dark text-white border-solix-dark shadow-solix-dark'
        : 'bg-white text-solix-dark border-solix-border shadow-solix'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${best ? 'text-solix-badge' : 'text-solix-green'}`}>
            {best ? 'Best match' : system.suitability}
          </span>
          <h3 className="text-xl font-extrabold mt-1">{system.label}</h3>
        </div>
        {system.type === 'hybrid' ? (
          <BatteryCharging className="w-6 h-6 text-solix-green" />
        ) : system.type === 'off-grid' ? (
          <Zap className="w-6 h-6 text-amber-500" />
        ) : (
          <Sun className="w-6 h-6 text-amber-400" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className={`rounded-2xl p-3 ${best ? 'bg-white/8' : 'bg-solix-bg'}`}>
          <span className={best ? 'text-white/60' : 'text-solix-muted'}>Installed PV</span>
          <div className="font-extrabold text-base mt-1">{system.actualPvCapacityKw} kWp</div>
        </div>
        <div className={`rounded-2xl p-3 ${best ? 'bg-white/8' : 'bg-solix-bg'}`}>
          <span className={best ? 'text-white/60' : 'text-solix-muted'}>Inverter</span>
          <div className="font-extrabold text-base mt-1">{system.inverterKw} kW</div>
        </div>
        <div className={`rounded-2xl p-3 ${best ? 'bg-white/8' : 'bg-solix-bg'}`}>
          <span className={best ? 'text-white/60' : 'text-solix-muted'}>Panels</span>
          <div className="font-extrabold text-base mt-1">{system.panelCount}</div>
        </div>
        <div className={`rounded-2xl p-3 ${best ? 'bg-white/8' : 'bg-solix-bg'}`}>
          <span className={best ? 'text-white/60' : 'text-solix-muted'}>Consumption match</span>
          <div className="font-extrabold text-base mt-1">{system.consumptionCoveragePercent}%</div>
        </div>
      </div>

      {system.battery && (
        <div className={`rounded-2xl border p-3 text-xs ${
          best ? 'border-white/15 bg-white/5' : 'border-solix-border bg-solix-bg'
        }`}>
          <span className={best ? 'text-white/60' : 'text-solix-muted'}>Preliminary battery range</span>
          <div className="font-extrabold text-base mt-1">
            {formatBatteryRange(system.battery.minKwh, system.battery.maxKwh)}
          </div>
        </div>
      )}

      <div className="space-y-2 text-xs">
        <div className="flex justify-between gap-3">
          <span className={best ? 'text-white/60' : 'text-solix-muted'}>Annual generation</span>
          <strong>{formatNumber(system.annualGenerationKwh)} kWh</strong>
        </div>
        <div className="flex justify-between gap-3">
          <span className={best ? 'text-white/60' : 'text-solix-muted'}>Seasonal match</span>
          <strong className="capitalize">{system.seasonalMatch}</strong>
        </div>
      </div>

      {system.caution && (
        <p className={`text-[11px] leading-relaxed ${best ? 'text-white/65' : 'text-solix-muted'}`}>
          {system.caution}
        </p>
      )}
    </div>
  );
}

export function SolarBillAnalyzer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<AnalyzerStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extraction, setExtraction] = useState<ExtractionResponse | null>(null);
  const [monthlyValues, setMonthlyValues] = useState(createEmptyMonthlyValues);
  const [monthConfidence, setMonthConfidence] = useState<Partial<Record<AnalyzerMonthKey, AnalyzerConfidence>>>({});
  const [city, setCity] = useState('');
  const [result, setResult] = useState<SolarRecommendationResponse | null>(null);
  const [backupLevel, setBackupLevel] = useState<BackupLevel>('essential');
  const [backupHours, setBackupHours] = useState<2 | 4 | 6 | 8>(4);
  const [knownBackupLoadKw, setKnownBackupLoadKw] = useState('');
  const [showBatteryRefinement, setShowBatteryRefinement] = useState(false);

  const metrics = useMemo(() => calculateAnalyzerMetrics(monthlyValues), [monthlyValues]);

  const chooseFile = async (selected: File | null) => {
    if (!selected) return;
    setError('');
    const validationError = await validateAnalyzerBillFile(selected);
    if (validationError) {
      setFile(null);
      setError(validationError);
      return;
    }
    setFile(selected);
  };

  const analyzeBill = async () => {
    if (!file) {
      setError('Select an electricity bill first.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('bill', file);

    try {
      const response = await apiFetchWithTimeout(
        getApiUrl('/api/solar-analyzer/extract'),
        { method: 'POST', body: formData },
        35_000
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'The bill could not be analyzed.');
      }

      const extracted = data as ExtractionResponse;
      setExtraction(extracted);
      setMonthlyValues(monthlyValuesFromExtraction(extracted));
      setMonthConfidence(
        extracted.normalizedHistory.reduce((confidence, item) => {
          if (item.confidence) confidence[item.month] = item.confidence;
          return confidence;
        }, {} as Partial<Record<AnalyzerMonthKey, AnalyzerConfidence>>)
      );
      setCity(extracted.extraction.city || '');
      setStep('verify');
    } catch (requestError) {
      const timedOut = requestError instanceof Error && requestError.name === 'AbortError';
      setError(
        timedOut
          ? 'Bill analysis timed out. Retry or enter consumption manually.'
          : requestError instanceof Error
            ? requestError.message
            : 'Bill analysis failed. Retry or enter consumption manually.'
      );
    } finally {
      setLoading(false);
    }
  };

  const enterManually = () => {
    setExtraction(null);
    setMonthlyValues(createEmptyMonthlyValues());
    setMonthConfidence({});
    setCity('');
    setError('');
    setStep('verify');
  };

  const requestRecommendation = async (refineBattery = false) => {
    if (!metrics.complete) {
      setError('Enter a verified consumption value for all twelve months.');
      return;
    }
    if (city.trim().length < 2) {
      setError('Select or enter the Pakistani installation city.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload: Record<string, unknown> = {
        city: city.trim(),
        monthlyConsumption: ANALYZER_MONTHS.map((month) => ({
          month: month.key,
          kwh: Number(monthlyValues[month.key]),
        })),
      };

      if (refineBattery) {
        payload.batteryPreferences = {
          backupLevel,
          backupHours,
          ...(knownBackupLoadKw && Number(knownBackupLoadKw) > 0
            ? { knownBackupLoadKw: Number(knownBackupLoadKw) }
            : {}),
        };
      }

      const response = await apiFetchWithTimeout(
        getApiUrl('/api/solar-analyzer/recommend'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
        12_000
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'The recommendation could not be calculated.');
      }

      setResult(data as SolarRecommendationResponse);
      setStep('results');
      if (refineBattery) setShowBatteryRefinement(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The recommendation could not be calculated.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setStep('upload');
    setFile(null);
    setExtraction(null);
    setMonthlyValues(createEmptyMonthlyValues());
    setMonthConfidence({});
    setCity('');
    setResult(null);
    setError('');
    setShowBatteryRefinement(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-2 sm:gap-4" aria-label="Analyzer progress">
        {[
          ['upload', '1', 'Upload bill'],
          ['verify', '2', 'Verify usage'],
          ['results', '3', 'Compare systems'],
        ].map(([key, number, label], index) => {
          const active = step === key;
          const complete = ['upload', 'verify', 'results'].indexOf(step) > index;
          return (
            <React.Fragment key={key}>
              {index > 0 && <div className={`h-px w-6 sm:w-16 ${complete || active ? 'bg-solix-green' : 'bg-solix-border'}`} />}
              <div className={`flex items-center gap-2 text-xs font-bold ${active || complete ? 'text-solix-dark' : 'text-solix-muted'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  active || complete ? 'bg-solix-dark text-white' : 'bg-white border border-solix-border'
                }`}>
                  {complete ? <CheckCircle2 className="w-4 h-4" /> : number}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {error && (
        <div className="max-w-4xl mx-auto bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-start gap-3 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {step === 'upload' && (
        <section className="max-w-4xl mx-auto bg-white border border-solix-border rounded-3xl shadow-solix-lg p-6 sm:p-10 space-y-7">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center mx-auto text-solix-green">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-solix-dark">Upload your electricity bill</h2>
            <p className="text-sm text-solix-muted max-w-xl mx-auto">
              Gemini reads consumption figures only. ENE&apos;s calculation engine independently sizes and compares three solar options.
            </p>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              void chooseFile(event.dataTransfer.files[0] || null);
            }}
            className={`rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragging
                ? 'border-solix-green bg-emerald-50'
                : file
                  ? 'border-solix-green/50 bg-emerald-50/50'
                  : 'border-solix-border bg-solix-bg hover:border-solix-green/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="sr-only"
              onChange={(event) => void chooseFile(event.target.files?.[0] || null)}
            />
            {file ? (
              <div className="space-y-3">
                <CheckCircle2 className="w-9 h-9 text-solix-green mx-auto" />
                <div>
                  <p className="font-bold text-solix-dark break-all">{file.name}</p>
                  <p className="text-xs text-solix-muted mt-1">{formatNumber(file.size / 1024 / 1024, 2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  <X className="w-3.5 h-3.5" /> Remove or replace
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <UploadCloud className="w-10 h-10 text-solix-green mx-auto" />
                <div>
                  <p className="font-bold text-solix-dark">Drop your bill here or select a file</p>
                  <p className="text-xs text-solix-muted mt-1">PDF, JPG, JPEG or PNG · Maximum 10 MB</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 bg-solix-bg rounded-2xl p-4 text-xs text-solix-muted">
            <ShieldCheck className="w-5 h-5 text-solix-green shrink-0" />
            <p>
              Your bill is processed in memory to extract consumption data. ENE does not permanently store the original file or return account, meter, consumer, or address details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={analyzeBill}
              disabled={!file || loading}
              className="inline-flex items-center justify-center gap-2 bg-solix-dark hover:bg-black disabled:opacity-50 text-white text-sm font-bold px-7 py-3.5 rounded-full transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Reading your bill...' : 'Analyze Electricity Bill'}
            </button>
            <button
              type="button"
              onClick={enterManually}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-white border border-solix-border hover:bg-solix-bg text-solix-dark text-sm font-bold px-7 py-3.5 rounded-full transition-colors"
            >
              Enter Consumption Manually
            </button>
          </div>
        </section>
      )}

      {step === 'verify' && (
        <section className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white border border-solix-border rounded-3xl shadow-solix p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solix-green">Verify before calculation</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-solix-dark mt-1">Confirm monthly electricity usage</h2>
                <p className="text-xs sm:text-sm text-solix-muted mt-2">
                  Correct any unclear values. Only your verified figures are used for sizing.
                </p>
              </div>
              <span className={`self-start px-3 py-1.5 rounded-full border text-[11px] font-bold capitalize ${
                extraction
                  ? CONFIDENCE_STYLES[extraction.extraction.overallConfidence]
                  : 'text-solix-muted bg-solix-bg border-solix-border'
              }`}>
                Bill analysis confidence: {extraction?.extraction.overallConfidence || 'Manual entry'}
              </span>
            </div>

            {extraction?.extraction.warnings.length ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-xs space-y-1">
                {extraction.extraction.warnings.map((warning) => <p key={warning}>• {warning}</p>)}
              </div>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {ANALYZER_MONTHS.map((month) => {
                const confidence = monthConfidence[month.key];
                const missing = monthlyValues[month.key] === '';
                return (
                  <label
                    key={month.key}
                    className={`rounded-2xl border p-3 space-y-2 ${
                      missing || confidence === 'low'
                        ? 'border-amber-300 bg-amber-50/60'
                        : 'border-solix-border bg-solix-bg'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2 text-[11px] font-bold text-solix-dark">
                      {month.label}
                      {confidence && (
                        <span className={`capitalize ${confidence === 'low' ? 'text-rose-600' : confidence === 'medium' ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {confidence}
                        </span>
                      )}
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={monthlyValues[month.key]}
                        onChange={(event) => {
                          setMonthlyValues((values) => ({ ...values, [month.key]: event.target.value }));
                          setMonthConfidence((confidenceMap) => ({ ...confidenceMap, [month.key]: 'high' }));
                        }}
                        placeholder="Enter kWh"
                        className="w-full bg-white border border-solix-border rounded-xl px-3 py-2.5 pr-10 text-base sm:text-sm font-bold text-solix-dark focus:outline-none focus:border-solix-green"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-bold text-solix-muted">kWh</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
              <label className="space-y-2">
                <span className="text-xs font-bold text-solix-dark flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-solix-green" /> Installation city in Pakistan
                </span>
                <input
                  list="pakistan-analyzer-cities"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Select or enter city"
                  className="w-full bg-solix-bg border border-solix-border rounded-2xl px-4 py-3 text-base sm:text-sm font-semibold focus:outline-none focus:border-solix-green"
                />
                <datalist id="pakistan-analyzer-cities">
                  {PAKISTAN_CITIES.map((item) => <option key={item} value={item} />)}
                </datalist>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['Annual usage', `${formatNumber(metrics.annualKwh)} kWh`],
                  ['Monthly average', `${formatNumber(metrics.averageMonthlyKwh)} kWh`],
                  ['Highest month', metrics.highestMonth ? `${metrics.highestMonth.month.toUpperCase()} · ${formatNumber(metrics.highestMonth.kwh)}` : 'Missing'],
                  ['Lowest month', metrics.lowestMonth ? `${metrics.lowestMonth.month.toUpperCase()} · ${formatNumber(metrics.lowestMonth.kwh)}` : 'Missing'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-solix-dark text-white p-4">
                    <span className="text-[10px] text-white/55 uppercase tracking-wider">{label}</span>
                    <div className="text-sm font-extrabold mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {!metrics.complete && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                {12 - metrics.validMonthCount} month{12 - metrics.validMonthCount === 1 ? '' : 's'} still need verification. Missing values are never estimated or fabricated.
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-solix-muted hover:text-solix-dark px-4 py-3"
              >
                <ArrowLeft className="w-4 h-4" /> Back to bill upload
              </button>
              <button
                type="button"
                onClick={() => void requestRecommendation()}
                disabled={!metrics.complete || city.trim().length < 2 || loading}
                className="inline-flex items-center justify-center gap-2 bg-solix-dark hover:bg-black disabled:opacity-50 text-white text-sm font-bold px-7 py-3.5 rounded-full transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
                {loading ? 'Calculating...' : 'Compare Solar Systems'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 'results' && result && (
        <section className="max-w-7xl mx-auto space-y-8">
          <div className="bg-solix-dark text-white rounded-3xl p-7 sm:p-10 shadow-solix-dark relative overflow-hidden">
            <Sun className="absolute -right-10 -top-10 w-56 h-56 text-white/[0.03]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-solix-badge">
                  <Sparkles className="w-4 h-4" /> Best match
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold mt-3 tracking-tight">
                  {result.bestMatch.actualPvCapacityKw} kWp {result.bestMatch.label}
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mt-4 max-w-3xl">
                  {result.explanation}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-white/55 uppercase">Inverter</span>
                  <div className="text-2xl font-extrabold mt-1">{result.bestMatch.inverterKw} kW</div>
                </div>
                <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-white/55 uppercase">Panels</span>
                  <div className="text-2xl font-extrabold mt-1">{result.bestMatch.panelCount}</div>
                </div>
                <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-white/55 uppercase">Annual solar</span>
                  <div className="text-lg font-extrabold mt-1">{formatNumber(result.bestMatch.annualGenerationKwh)} kWh</div>
                </div>
                <div className="bg-white/8 border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-white/55 uppercase">Seasonal match</span>
                  <div className="text-lg font-extrabold capitalize mt-1">{result.bestMatch.seasonalMatch}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <SystemCard system={result.systems.onGrid} best />
            <SystemCard system={result.systems.hybrid} />
            <SystemCard system={result.systems.offGrid} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-solix-border rounded-3xl p-6 sm:p-8 shadow-solix space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solix-green">Bill analysis</span>
                <h3 className="text-2xl font-extrabold mt-1">Verified consumption</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Annual consumption', `${formatNumber(result.consumption.annualKwh)} kWh`],
                  ['Monthly average', `${formatNumber(result.consumption.averageMonthlyKwh)} kWh`],
                  ['Average daily', `${formatNumber(result.consumption.averageDailyKwh, 1)} kWh`],
                  ['Recommendation data', result.dataCompleteness],
                ].map(([label, value]) => (
                  <div key={label} className="bg-solix-bg rounded-2xl p-4">
                    <span className="text-[10px] uppercase text-solix-muted">{label}</span>
                    <div className="font-extrabold text-sm sm:text-base mt-1 capitalize">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 text-xs text-solix-muted border-t border-solix-border pt-4">
                <MapPin className="w-4 h-4 text-solix-green shrink-0" />
                <span>
                  {result.location.fallbackUsed
                    ? `${result.location.requestedCity} uses the conservative ${result.location.profileCity} regional profile.`
                    : `${result.location.profileCity} monthly solar profile applied.`}
                </span>
              </div>
            </div>

            <div className="bg-white border border-solix-border rounded-3xl p-6 sm:p-8 shadow-solix space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solix-green">Monthly energy model</span>
                <h3 className="text-2xl font-extrabold mt-1">Consumption vs solar</h3>
              </div>
              <div className="space-y-2.5">
                {result.bestMatch.monthlySimulation.map((month) => {
                  const maxValue = Math.max(month.consumptionKwh, month.generationKwh, 1);
                  return (
                    <div key={month.month} className="grid grid-cols-[34px_1fr_58px] items-center gap-3 text-[10px]">
                      <strong className="uppercase text-solix-muted">{month.month}</strong>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-solix-border rounded-full overflow-hidden">
                          <div className="h-full bg-solix-dark rounded-full" style={{ width: `${(month.consumptionKwh / maxValue) * 100}%` }} />
                        </div>
                        <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full bg-solix-green rounded-full" style={{ width: `${(month.generationKwh / maxValue) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-right font-bold text-solix-muted">{month.coveragePercent}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 text-[10px] text-solix-muted">
                <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-solix-dark" /> Consumption</span>
                <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-solix-green" /> Solar generation</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-solix-border rounded-3xl p-6 sm:p-8 shadow-solix">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solix-green">Optional</span>
                <h3 className="text-xl font-extrabold mt-1">Refine the Hybrid battery estimate</h3>
                <p className="text-xs text-solix-muted mt-1">A bill cannot reveal your exact backup load. Two short choices improve the preliminary range.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowBatteryRefinement((visible) => !visible)}
                className="inline-flex items-center justify-center gap-2 border border-solix-border bg-solix-bg hover:bg-white text-solix-dark text-xs font-bold px-5 py-3 rounded-full"
              >
                <BatteryCharging className="w-4 h-4 text-solix-green" /> Refine Battery Estimate
              </button>
            </div>

            {showBatteryRefinement && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-solix-border animate-fadeIn">
                <label className="space-y-2 text-xs font-bold">
                  Backup level
                  <select
                    value={backupLevel}
                    onChange={(event) => setBackupLevel(event.target.value as BackupLevel)}
                    className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-3 text-sm font-semibold"
                  >
                    <option value="essential">Essential loads</option>
                    <option value="most">Most property loads</option>
                    <option value="entire">Entire property</option>
                  </select>
                </label>
                <label className="space-y-2 text-xs font-bold">
                  Backup duration
                  <select
                    value={backupHours}
                    onChange={(event) => setBackupHours(Number(event.target.value) as 2 | 4 | 6 | 8)}
                    className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-3 text-sm font-semibold"
                  >
                    <option value={2}>2 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={6}>6 hours</option>
                    <option value={8}>8+ hours</option>
                  </select>
                </label>
                <label className="space-y-2 text-xs font-bold">
                  Known backup load (optional kW)
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={knownBackupLoadKw}
                    onChange={(event) => setKnownBackupLoadKw(event.target.value)}
                    placeholder="e.g. 3.5"
                    className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-3 text-sm font-semibold"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void requestRecommendation(true)}
                  disabled={loading}
                  className="sm:col-start-3 inline-flex items-center justify-center gap-2 bg-solix-dark text-white text-xs font-bold px-5 py-3 rounded-full disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Update battery range
                </button>
              </div>
            )}
          </div>

          <div className="bg-solix-dark text-white rounded-3xl p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Ready for an exact solar proposal?</h3>
              <p className="text-sm text-white/65 mt-2 max-w-2xl">
                An ENE engineer can verify roof space, shading, electrical loads, equipment, and utility requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={buildAnalyzerQuoteUrl(
                  result,
                  extraction?.extraction.overallConfidence || 'manual'
                )}
                className="inline-flex items-center justify-center gap-2 bg-white text-solix-dark hover:bg-solix-bg text-sm font-bold px-6 py-3.5 rounded-full"
              >
                Get an Exact Proposal <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={buildWhatsAppUrl(buildAnalyzerWhatsAppMessage(result))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-solix-green hover:bg-solix-greenHover text-white text-sm font-bold px-6 py-3.5 rounded-full"
              >
                Continue on WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-white border border-solix-border rounded-3xl p-5 text-xs text-solix-muted space-y-2">
            <p><strong className="text-solix-dark">Assumptions:</strong> {result.assumptions.panelWattage} W panels, {Math.round(result.assumptions.performanceRatio * 100)}% performance ratio, {result.assumptions.dcAcRatioTarget} target DC/AC ratio.</p>
            <p>{result.assumptions.selectionRule}</p>
            <p>{result.assumptions.profileBasis}</p>
            <p className="pt-2 border-t border-solix-border">{result.disclaimer}</p>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={resetAnalyzer}
              className="inline-flex items-center gap-2 text-xs font-bold text-solix-muted hover:text-solix-dark px-4 py-2"
            >
              <RefreshCw className="w-4 h-4" /> Analyze another bill
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
