import { useState } from 'react';
import { Check, CloudRain, Droplets, Fuel, Sparkles, Trophy } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onComplete?: () => void;
}

export function IrrigationDecisionTool({ onComplete }: Props) {
  const [soilMoisture, setSoilMoisture] = useState<number>(18); // 10% (bone dry) to 40% (waterlogged)
  const [rainProb, setRainProb] = useState<number>(35); // 0 to 100%
  const [growthStage, setGrowthStage] = useState<'seedling' | 'vegetative' | 'flowering' | 'harvest'>('flowering');
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  // Agronomic logic:
  // - Flowering stage has critical water requirement (wilting causes flower drop and 50% yield loss)
  // - Critical threshold for loam soil is ~22%
  const isCriticalStage = growthStage === 'flowering';
  const threshold = isCriticalStage ? 24 : 18;

  let decision: {
    status: 'urgent-irrigate' | 'irrigate-light' | 'hold-rain' | 'saturated-hold';
    headline: string;
    action: string;
    rationale: string;
    smsText: string;
    waterSavedLiters: number;
    fuelCostSaved: number;
  };

  if (soilMoisture > 30) {
    decision = {
      status: 'saturated-hold',
      headline: 'HOLD: Soil At Field Capacity',
      action: 'Keep Drip Valves Closed (0 Minutes)',
      rationale: 'Root zone is fully saturated (>30% VWC). Further irrigation risks root rot, anaerobic conditions, and nutrient leaching.',
      smsText: 'Habari! Soil is moist and roots are happy. Do not run pump today. Save fuel.',
      waterSavedLiters: 1200,
      fuelCostSaved: 4.5,
    };
  } else if (rainProb >= 65 && soilMoisture >= 16) {
    decision = {
      status: 'hold-rain',
      headline: 'HOLD: Heavy Rain Probable Within 18 Hours',
      action: 'Hold Irrigation & Monitor Weather',
      rationale: `Rain probability is ${rainProb}%. Natural precipitation will recharge root zone without diesel pump expense. If dry by tomorrow 8 AM, system will auto-trigger.`,
      smsText: `High chance of rain tonight (${rainProb}%). Keep pump off. Rain will water your crops naturally!`,
      waterSavedLiters: 950,
      fuelCostSaved: 3.8,
    };
  } else if (soilMoisture < threshold) {
    decision = {
      status: 'urgent-irrigate',
      headline: isCriticalStage ? 'URGENT: Flowering Stage Water Stress' : 'SCHEDULE: Irrigation Recommended',
      action: isCriticalStage ? 'Trigger Drip Line: 60 Minutes (High Flow)' : 'Trigger Drip Line: 35 Minutes',
      rationale: `Soil moisture (${soilMoisture}%) is below critical threshold (${threshold}%). ${
        isCriticalStage ? 'Flowering crops will drop blossoms if moisture is not replenished within 6 hours.' : 'Vegetative growth slowing down.'
      }`,
      smsText: `Moisture is low (${soilMoisture}%). Run drip irrigation for ${isCriticalStage ? '60' : '35'} minutes now before midday heat.`,
      waterSavedLiters: 0,
      fuelCostSaved: 0,
    };
  } else {
    decision = {
      status: 'irrigate-light',
      headline: 'MAINTAIN: Moisture Adequate',
      action: 'Light Pulse Irrigation (15 Minutes) or Hold',
      rationale: 'Moisture is within acceptable transpiration band. Minimal pulse recommended only if temperatures exceed 34°C.',
      smsText: 'Moisture is stable. No heavy watering needed today.',
      waterSavedLiters: 500,
      fuelCostSaved: 2.1,
    };
  }

  const handleSliderChange = (setter: (v: number) => void, val: number) => {
    sound.playClick();
    setter(val);
  };

  const handleLockDecision = () => {
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
            <Droplets className="w-5 h-5 text-blue-400" /> Multi-Sensor Irrigation Prescriptive Engine
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Fuse real-time soil capacitance probes, satellite crop stages, and localized rainfall probabilities.
          </p>
        </div>
      </div>

      {/* Control sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Soil Moisture */}
        <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-stone-300 font-medium flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" /> Soil Moisture (30cm depth)
            </span>
            <span className="font-mono text-blue-400 font-bold">{soilMoisture}% VWC</span>
          </div>
          <input
            type="range"
            min="10"
            max="38"
            step="1"
            value={soilMoisture}
            onChange={(e) => handleSliderChange(setSoilMoisture, Number(e.target.value))}
            className="w-full h-2 bg-stone-800 rounded accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
            <span>10% (Wilting)</span>
            <span>22% (Optimum)</span>
            <span>38% (Saturated)</span>
          </div>
        </div>

        {/* Rain probability */}
        <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-stone-300 font-medium flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-cyan-400" /> 24h Rain Probability
            </span>
            <span className="font-mono text-cyan-400 font-bold">{rainProb}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={rainProb}
            onChange={(e) => handleSliderChange(setRainProb, Number(e.target.value))}
            className="w-full h-2 bg-stone-800 rounded accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
            <span>0% (Clear Sky)</span>
            <span>50% (Scattered)</span>
            <span>95% (Downpour)</span>
          </div>
        </div>

        {/* Growth stage */}
        <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
          <label className="text-xs text-stone-300 font-medium flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Crop Phenology Stage
          </label>
          <select
            value={growthStage}
            onChange={(e) => {
              sound.playClick();
              setGrowthStage(e.target.value as 'seedling' | 'vegetative' | 'flowering' | 'harvest');
            }}
            className="w-full bg-stone-900 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-200 outline-none focus:border-emerald-500"
          >
            <option value="seedling">Seedling / Establishment (Low demand)</option>
            <option value="vegetative">Vegetative Canopy Growth (Moderate)</option>
            <option value="flowering">Flowering & Fruit Set (CRITICAL - Highly sensitive)</option>
            <option value="harvest">Maturity & Pre-Harvest (Dry-down)</option>
          </select>
          <span className="text-[10px] text-stone-500 block mt-1.5 font-mono">
            Critical threshold: <strong className="text-amber-400">{threshold}% VWC</strong>
          </span>
        </div>
      </div>

      {/* Decision Output Card */}
      <div className={`mt-5 p-4 rounded-xl border ${
        decision.status === 'urgent-irrigate'
          ? 'bg-red-950/20 border-red-800/50'
          : decision.status === 'hold-rain' || decision.status === 'saturated-hold'
          ? 'bg-blue-950/20 border-blue-800/50'
          : 'bg-emerald-950/20 border-emerald-800/50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-mono text-stone-400 block">Prescriptive Advisory</span>
            <h4 className="text-base font-bold text-stone-100 mt-0.5">{decision.headline}</h4>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold self-start sm:self-center ${
            decision.status === 'urgent-irrigate'
              ? 'bg-red-950 text-red-300 border border-red-800'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            {decision.action}
          </span>
        </div>

        <div className="mt-3 text-xs text-stone-300 leading-relaxed">
          {decision.rationale}
        </div>

        {/* Farmer SMS card */}
        <div className="mt-3 bg-stone-950 p-3 rounded-lg border border-stone-800">
          <div className="text-[10px] text-stone-500 font-mono uppercase mb-1">
            Generated Farmer SMS Dispatch (Swahili/English)
          </div>
          <div className="text-xs font-mono text-amber-300 italic">
            "{decision.smsText}"
          </div>
        </div>

        {/* Resource savings telemetry */}
        {(decision.waterSavedLiters > 0 || decision.fuelCostSaved > 0) && (
          <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center gap-4 text-xs">
            <span className="text-stone-400 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Water Conserved: <strong className="text-stone-200 font-mono">{decision.waterSavedLiters} L</strong>
            </span>
            <span className="text-stone-400 flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              Pump Diesel Saved: <strong className="text-emerald-400 font-mono">${decision.fuelCostSaved}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-stone-400">
          Prescriptive engines convert telemetry data into clear, fuel-saving farmer instructions.
        </span>

        <button
          onClick={handleLockDecision}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
            hasCompleted
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
          }`}
        >
          {hasCompleted ? (
            <>
              <Check className="w-4 h-4" /> Telemetry Decision Mastered! (+85 XP)
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 text-amber-300" /> Lock Telemetry Decision
            </>
          )}
        </button>
      </div>
    </div>
  );
}
