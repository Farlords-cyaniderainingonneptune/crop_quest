import { useState } from 'react';
import { CheckCircle2, DollarSign, Sliders, Trophy, AlertOctagon } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onComplete?: () => void;
}

export function VisionThresholdTool({ onComplete }: Props) {
  // Threshold as percentage (50% to 95%)
  const [threshold, setThreshold] = useState<number>(75);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Constants for simulated field sample (100 evaluated leaf samples):
  // 35 leaves genuinely have Fall Armyworm caterpillars/damage.
  // 65 leaves are healthy or have benign non-pest blemishes.
  const totalInfected = 35;
  const totalHealthy = 65;

  // Modeling TP, FP, FN, TN as function of threshold
  // As threshold rises:
  // - True Positives decrease (miss more borderline pests)
  // - False Positives decrease (fewer false alarms)
  // - False Negatives increase (devastating yield damage)
  // - True Negatives increase
  const normalized = (threshold - 50) / 45; // 0 (at 50%) to 1 (at 95%)

  const truePositives = Math.round(totalInfected * (1 - normalized * 0.45)); // from 35 down to 19
  const falseNegatives = totalInfected - truePositives; // from 0 up to 16
  const falsePositives = Math.round(28 * Math.pow(1 - normalized, 1.8)); // from 28 down to 1
  const trueNegatives = totalHealthy - falsePositives;

  // Financial impact calculation for a 5-hectare smallholder maize parcel:
  // - Spray cost per false alarm = $12 (bio-pesticide + labor)
  // - Crop loss per missed infestation = $85 (caterpillars multiply and destroy cobs)
  const falsePositiveCost = falsePositives * 12;
  const falseNegativeCost = falseNegatives * 85;
  const totalLoss = falsePositiveCost + falseNegativeCost;

  // Maximum potential loss is ~$1,360.
  const protectedYieldValue = truePositives * 85;
  const netEconomicBenefit = protectedYieldValue - (falsePositives * 12 + truePositives * 12);

  const precision = Math.round((truePositives / (truePositives + falsePositives || 1)) * 100);
  const recall = Math.round((truePositives / (truePositives + falseNegatives || 1)) * 100);

  const handleSliderChange = (newVal: number) => {
    sound.playClick();
    setThreshold(newVal);
  };

  const handleSaveCalibration = () => {
    sound.playSuccess();
    setHasCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 md:p-6 text-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div>
          <h3 className="text-xl font-bold font-serif text-emerald-400 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" /> Pest Vision Confidence Threshold
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Simulate 100 leaf scans of Fall Armyworm on maize. Balance False Positives (wasted spray) against False Negatives (lost crop).
          </p>
        </div>

        <div className="bg-stone-950 px-3.5 py-1.5 rounded-lg border border-stone-800 self-start sm:self-center">
          <span className="text-xs text-stone-400">Current Threshold: </span>
          <span className="text-base font-bold text-amber-400 font-mono">{threshold}%</span>
        </div>
      </div>

      {/* Interactive slider control */}
      <div className="mt-5 p-4 rounded-xl bg-stone-950/80 border border-stone-800">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-stone-300">
            Model Activation Threshold ({threshold}%)
          </label>
          <span className="text-xs text-stone-400 font-mono">
            {threshold < 65 ? 'High Recall (Aggressive)' : threshold > 85 ? 'High Precision (Conservative)' : 'Balanced Agronomic Sweet Spot'}
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="95"
          step="1"
          value={threshold}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-2.5 bg-stone-800 rounded-lg accent-emerald-500 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-stone-500 mt-1.5 font-mono">
          <span>50% (Flag easily)</span>
          <span className="text-emerald-400 font-sans">Ideal Agronomic Zone (72-78%)</span>
          <span>95% (Only flag certainties)</span>
        </div>
      </div>

      {/* Metrics Row: Confusion Matrix & Financial impact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl">
          <div className="text-[11px] text-emerald-400 uppercase tracking-wider font-mono">True Positives</div>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">{truePositives} / 35</div>
          <p className="text-[11px] text-stone-400 mt-1">Infestations caught & treated</p>
        </div>

        <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl">
          <div className="text-[11px] text-amber-400 uppercase tracking-wider font-mono">False Positives</div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">{falsePositives}</div>
          <p className="text-[11px] text-stone-400 mt-1">Healthy leaves unnecessarily sprayed (${falsePositiveCost} wasted)</p>
        </div>

        <div className="bg-red-950/20 border border-red-800/40 p-3 rounded-xl">
          <div className="text-[11px] text-red-400 uppercase tracking-wider font-mono">False Negatives</div>
          <div className="text-xl font-bold font-mono text-red-300 mt-0.5">{falseNegatives}</div>
          <p className="text-[11px] text-stone-400 mt-1">Pests missed (${falseNegativeCost} crop damage)</p>
        </div>

        <div className="bg-blue-950/20 border border-blue-800/40 p-3 rounded-xl">
          <div className="text-[11px] text-blue-400 uppercase tracking-wider font-mono">True Negatives</div>
          <div className="text-xl font-bold font-mono text-blue-300 mt-0.5">{trueNegatives} / 65</div>
          <p className="text-[11px] text-stone-400 mt-1">Healthy plants correctly identified</p>
        </div>
      </div>

      {/* Economic & Model Tradeoff Summary */}
      <div className="mt-4 p-4 rounded-xl bg-stone-950 border border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-stone-500 font-mono mb-2">
            Machine Learning Metrics
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-stone-300 mb-0.5">
                <span>Recall (Sensitivity to Pests)</span>
                <span className="font-mono text-emerald-400 font-bold">{recall}%</span>
              </div>
              <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${recall}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-stone-300 mb-0.5">
                <span>Precision (Correct Alarms)</span>
                <span className="font-mono text-blue-400 font-bold">{precision}%</span>
              </div>
              <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${precision}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-stone-500 font-mono mb-2 flex items-center justify-between">
            <span>Smallholder Economic Impact</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Net Benefit
            </span>
          </div>
          <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-xs space-y-1">
            <div className="flex justify-between text-stone-300">
              <span>Gross Crop Harvest Saved:</span>
              <span className="font-mono text-emerald-400">+${protectedYieldValue}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Wasted Chemical Cost:</span>
              <span className="font-mono text-amber-400">-${falsePositiveCost}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Damage from Missed Pests:</span>
              <span className="font-mono text-red-400">-${falseNegativeCost}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-stone-800 text-stone-100 font-bold">
              <span>Net Smallholder Gain:</span>
              <span className="font-mono text-emerald-300 text-sm">
                +${Math.max(0, netEconomicBenefit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Didactic tip */}
      {threshold >= 88 && (
        <div className="mt-3 p-3 bg-red-950/30 border border-red-800/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            <strong>Warning:</strong> Threshold is too strict! Missing {falseNegatives} Fall Armyworm caterpillars causes ${falseNegativeCost} in lost maize cobs.
          </span>
        </div>
      )}

      {threshold <= 58 && (
        <div className="mt-3 p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg text-xs text-amber-300 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Caution:</strong> Threshold is too loose! Triggering {falsePositives} false alarms wastes ${falsePositiveCost} of the farmer's scarce cash on unneeded spray.
          </span>
        </div>
      )}

      {/* Action footer */}
      <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-stone-400">
          Optimal range: <strong>72% - 78%</strong> balances harvest preservation with chemical conservation.
        </span>

        <button
          onClick={handleSaveCalibration}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            hasCompleted
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
          }`}
        >
          {hasCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Threshold Calibrated! (+85 XP)
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 text-amber-300" /> Lock Model Calibration
            </>
          )}
        </button>
      </div>
    </div>
  );
}
