import { useState } from 'react';
import { ArrowUpDown, Check, RefreshCw, Trophy } from 'lucide-react';
import { sound } from '../../utils/sound';

interface FeatureItem {
  id: string;
  name: string;
  description: string;
  reach: number; // smallholders reached in Q1
  impact: number; // 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)
  confidence: number; // percentage: 0.5, 0.8, 1.0
  effort: number; // person-weeks
  isRecommended: boolean;
}

const INITIAL_FEATURES: FeatureItem[] = [
  {
    id: 'f1',
    name: 'Offline Planting & Spacing Calculator',
    description: 'Instant seed-per-hectare formulas working with zero cellular reception in remote fields.',
    reach: 5000,
    impact: 2, // high
    confidence: 1.0, // 100% confident
    effort: 2, // 2 weeks
    isRecommended: true,
  },
  {
    id: 'f2',
    name: 'USSD *384# SMS Weather Alerts',
    description: 'Fallback text broadcasts for farmers using $15 basic feature phones without mobile data.',
    reach: 4200,
    impact: 2,
    confidence: 0.8,
    effort: 2.5,
    isRecommended: true,
  },
  {
    id: 'f3',
    name: '3D Drone Parcel Topography Visualizer',
    description: 'Interactive WebGL drone parcel elevation mesh to show slope runoff in 4K.',
    reach: 180,
    impact: 1,
    confidence: 0.5,
    effort: 8,
    isRecommended: false,
  },
  {
    id: 'f4',
    name: 'Real-Time WhatsApp Audio Agro-Query',
    description: 'Farmers send audio voice notes describing weed symptoms, transcribed and answered.',
    reach: 2200,
    impact: 1.5,
    confidence: 0.7,
    effort: 3.5,
    isRecommended: false,
  },
];

interface Props {
  onComplete?: () => void;
}

export function RiceMatrixTool({ onComplete }: Props) {
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  const [sprintCapacityWeeks, setSprintCapacityWeeks] = useState(5);
  const [hasCompleted, setHasCompleted] = useState(false);

  const calculateRice = (f: FeatureItem) => {
    return Math.round((f.reach * f.impact * f.confidence) / f.effort);
  };

  const updateParam = (id: string, field: 'reach' | 'impact' | 'confidence' | 'effort', value: number) => {
    sound.playClick();
    setFeatures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const sortedFeatures = [...features].sort((a, b) => calculateRice(b) - calculateRice(a));

  // Calculate cumulative effort
  let accumulatedEffort = 0;
  const featuresWithSprintStatus = sortedFeatures.map((f) => {
    const fitsInSprint = accumulatedEffort + f.effort <= sprintCapacityWeeks;
    if (fitsInSprint) {
      accumulatedEffort += f.effort;
    }
    return {
      ...f,
      fitsInSprint,
      riceScore: calculateRice(f),
    };
  });

  const handleConfirmSprint = () => {
    sound.playSuccess();
    setHasCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    sound.playClick();
    setFeatures(INITIAL_FEATURES);
    setSprintCapacityWeeks(5);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 md:p-6 text-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div>
          <h3 className="text-xl font-bold font-serif text-emerald-400">RICE Prioritization Matrix</h3>
          <p className="text-xs text-stone-400 mt-1">
            Formula: <span className="text-amber-300 font-mono font-medium">(Reach × Impact × Confidence) ÷ Effort</span>. Sorts features by return on engineering investment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
            <span className="text-xs text-stone-400">Sprint Capacity:</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{sprintCapacityWeeks} person-weeks</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-md transition-colors"
            title="Reset parameters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature cards list */}
      <div className="mt-5 space-y-4">
        {featuresWithSprintStatus.map((feature, idx) => {
          return (
            <div
              key={feature.id}
              className={`p-4 rounded-xl border transition-all ${
                feature.fitsInSprint
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : 'bg-stone-950/40 border-stone-800/80 opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-300 text-xs font-mono flex items-center justify-center font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-stone-100 text-sm md:text-base flex items-center gap-2">
                      {feature.name}
                      {feature.fitsInSprint ? (
                        <span className="text-[11px] font-sans font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded">
                          Included in Sprint MVP
                        </span>
                      ) : (
                        <span className="text-[11px] font-sans text-stone-500 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">
                          Cut from Sprint
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">{feature.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block">RICE Score</span>
                    <span className="text-lg md:text-xl font-bold font-mono text-amber-400">
                      {feature.riceScore.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider parameters controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-stone-800/60 text-xs">
                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Reach (Farmers)</span>
                    <span className="font-mono text-stone-200">{feature.reach}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="500"
                    value={feature.reach}
                    onChange={(e) => updateParam(feature.id, 'reach', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Impact (Multiplier)</span>
                    <span className="font-mono text-stone-200">{feature.impact}x</span>
                  </div>
                  <select
                    value={feature.impact}
                    onChange={(e) => updateParam(feature.id, 'impact', Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-stone-200 text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="0.5">0.5x (Minor bump)</option>
                    <option value="1">1.0x (Medium value)</option>
                    <option value="2">2.0x (High harvest impact)</option>
                    <option value="3">3.0x (Massive transformation)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Confidence</span>
                    <span className="font-mono text-stone-200">{Math.round(feature.confidence * 100)}%</span>
                  </div>
                  <select
                    value={feature.confidence}
                    onChange={(e) => updateParam(feature.id, 'confidence', Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-stone-200 text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="0.5">50% (High risk / unvalidated)</option>
                    <option value="0.8">80% (Substantial field data)</option>
                    <option value="1.0">100% (Proven field certainty)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Effort (Weeks)</span>
                    <span className="font-mono text-stone-200">{feature.effort} wks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={feature.effort}
                    onChange={(e) => updateParam(feature.id, 'effort', Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action footer */}
      <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-400 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Features automatically ranked by ROI. Total allocated:{' '}
            <strong className="text-stone-200 font-mono">{accumulatedEffort} / {sprintCapacityWeeks} weeks</strong>.
          </span>
        </div>

        <button
          onClick={handleConfirmSprint}
          disabled={hasCompleted}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            hasCompleted
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
          }`}
        >
          {hasCompleted ? (
            <>
              <Check className="w-4 h-4" /> Sprint Backlog Locked & Verified! (+80 XP)
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 text-amber-300" /> Lock Sprint Scope & Proceed
            </>
          )}
        </button>
      </div>
    </div>
  );
}
