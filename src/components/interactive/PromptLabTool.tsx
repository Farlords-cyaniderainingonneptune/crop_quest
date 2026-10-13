import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Play, Sparkles, Wand2, ShieldCheck, Flame } from 'lucide-react';
import { sound } from '../../utils/sound';

interface PromptPreset {
  id: string;
  name: string;
  farmerQuery: string;
  cropContext: string;
  badSystemPrompt: string;
  groundedSystemPrompt: string;
  badResponse: string;
  groundedResponse: string;
}

const PRESETS: PromptPreset[] = [
  {
    id: 'pest-tomato',
    name: 'Tomato Leaf Spot Diagnosis',
    cropContext: 'Tomato (Lycopersicon esculentum), 45 days after transplant, flowering stage.',
    farmerQuery: 'My leaves have dark brown concentric rings with yellow halos. Small holes appearing. What chemical should I spray right now?',
    badSystemPrompt: 'You are an AI farming assistant. Answer any questions the farmer has and recommend the best fast-acting chemicals to kill all bugs and fungi.',
    groundedSystemPrompt: `You are an expert Certified Agronomist specialized in smallholder vegetable production.
Follow these strict safety & IPM guidelines:
1. First, identify probable symptoms (e.g. Early Blight - Alternaria solani).
2. Prioritize cultural and organic practices FIRST (e.g. remove infected bottom leaves, avoid overhead splash irrigation).
3. Recommend biological treatments (Copper hydroxide, Bacillus subtilis or Neem extract) before synthetic chemicals.
4. If synthetic fungicides are mentioned, mandate personal protective equipment (PPE), strict dosage limits, and state the Pre-Harvest Interval (PHI).
5. Never invent or hallucinate unverified tank-mix cocktails. Keep language clear, non-technical, and actionable.`,
    badResponse: `Mix 400ml of Chlorpyrifos and 300ml of Mancozeb in a 16L knapsack sprayer. Spray the entire crop every 3 days at midday until all spots disappear completely. You can also mix in some kerosene to kill bugs faster!`,
    groundedResponse: `Probable Diagnosis: Early Blight (Alternaria solani), a common fungal disease triggered by warm humidity and leaf moisture.

Immediate Safe Action Plan:
1. Prune & Destroy: Clip off the bottom 3-4 affected yellowed leaves using clean shears. Do not compost them—burn or bury them away from the field to stop spore spread.
2. Irrigation Tweak: Switch from overhead bucket splashing to root-level watering. Blight spores splash from the soil onto lower leaves.
3. Biological Spray: Apply Copper-based spray (e.g., Copper Hydroxide @ 2.5g/liter) or neem oil early morning (before 9 AM).
4. Safety & PHI: Wear a face mask and gloves. Observe a 7-day Pre-Harvest Interval (do not harvest ripe fruit within 7 days of spraying).`,
  },
  {
    id: 'fertilizer-maize',
    name: 'Maize Fertilizer Guidance',
    cropContext: 'Maize, knee-high (V6 vegetative stage), sandy loam soil, dry spell forecasted.',
    farmerQuery: 'Should I broadcast my top-dressing Urea fertilizer today before the sun gets too hot?',
    badSystemPrompt: 'You are an agri-bot. Give short answers to fertilizer questions.',
    groundedSystemPrompt: `You are a Soil Fertility Specialist. Follow these rules:
1. Always evaluate soil moisture and weather conditions before recommending Urea top-dressing.
2. Prevent ammonia volatilization losses by warning against surface broadcasting on dry soil in hot sun.
3. Recommend soil incorporation (5cm deep) or applying just before gentle forecast rain.
4. Never recommend applying nitrogen fertilizers to moisture-stressed crops.`,
    badResponse: `Yes, go ahead and dump the Urea across the soil right now. More fertilizer always gives bigger cobs!`,
    groundedResponse: `Recommendation: HOLD Urea Application Today.

Reasoning:
1. Heat Volatilization Risk: Broad-casting dry Urea on dry soil during high temperatures causes nitrogen to escape into the air as ammonia gas. You can lose up to 40% of your expensive fertilizer value!
2. Dry Spell Danger: Without soil moisture, concentrated fertilizer causes root osmotic burn ("fertilizer burn").
3. Optimal Action: Wait for forecast rain, or incorporate the Urea 5cm deep into the moist root zone along the planting line and cover with soil immediately.`,
  },
];

interface Props {
  onComplete?: () => void;
}

export function PromptLabTool({ onComplete }: Props) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pest-tomato');
  const [activeTab, setActiveTab] = useState<'compare' | 'playground'>('compare');
  const [isGroundedMode, setIsGroundedMode] = useState<boolean>(true);
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(PRESETS[0].groundedSystemPrompt);
  const [customUserQuery, setCustomUserQuery] = useState<string>(PRESETS[0].farmerQuery);
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasTestedGrounded, setHasTestedGrounded] = useState<boolean>(false);

  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const handleSelectPreset = (preset: PromptPreset) => {
    sound.playClick();
    setSelectedPresetId(preset.id);
    setCustomSystemPrompt(preset.groundedSystemPrompt);
    setCustomUserQuery(preset.farmerQuery);
    setSimulatedOutput(null);
  };

  const handleRunTest = () => {
    sound.playClick();
    setIsAnalyzing(true);
    setSimulatedOutput(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      sound.playSuccess();
      setHasTestedGrounded(true);

      if (isGroundedMode || customSystemPrompt.includes('IPM') || customSystemPrompt.includes('safety')) {
        setSimulatedOutput(currentPreset.groundedResponse);
      } else {
        setSimulatedOutput(currentPreset.badResponse);
      }

      if (onComplete) {
        onComplete();
      }
    }, 700);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 md:p-6 text-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div>
          <h3 className="text-xl font-bold font-serif text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Agri-GenAI Prompt Studio
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Observe how structured system instructions transform unsafe hallucinations into grounded agronomic guidance.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 self-start sm:self-center">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('compare');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'compare' ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            A/B Safety Contrast
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('playground');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'playground' ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Prompt Playground
          </button>
        </div>
      </div>

      {/* Preset selection bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-500 font-medium">Scenario Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              selectedPresetId === p.id
                ? 'bg-stone-800 text-emerald-300 border-emerald-600/60 font-medium'
                : 'bg-stone-950/60 text-stone-400 border-stone-800 hover:border-stone-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {activeTab === 'compare' ? (
        /* A/B Comparison Layout */
        <div className="mt-5 space-y-5">
          {/* Farmer Input Card */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-lg p-3.5">
            <div className="text-[11px] uppercase tracking-wider text-stone-500 font-mono mb-1">
              Field Telemetry & Farmer Voice Query
            </div>
            <div className="text-xs text-amber-300 font-mono mb-1.5">Context: {currentPreset.cropContext}</div>
            <p className="text-sm text-stone-100 italic bg-stone-900/60 p-2.5 rounded border border-stone-800/80">
              "{currentPreset.farmerQuery}"
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Un-grounded Column */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-red-900/30">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-red-300 text-sm">Vague / Unconstrained Prompt</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/50">
                    High Hallucination Risk
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-stone-400 block mb-1">System Instruction:</span>
                  <div className="bg-stone-950/90 p-2 rounded text-xs text-stone-300 font-mono border border-stone-800">
                    {currentPreset.badSystemPrompt}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-stone-400 block mb-1">Generated Output:</span>
                  <div className="bg-red-950/40 p-3 rounded text-xs text-red-200 leading-relaxed border border-red-900/50">
                    {currentPreset.badResponse}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-red-900/30 text-xs text-red-300/90 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Fatal Flaw:</strong> Hallucinates hazardous chemical blends (kerosene, uncalibrated insecticides) without Pre-Harvest Intervals, posing grave toxicity and export rejection risks!
                </span>
              </div>
            </div>

            {/* Grounded Column */}
            <div className="bg-emerald-950/20 border border-emerald-700/50 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-emerald-900/30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-emerald-300 text-sm">Grounded Agronomy Architecture</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                    Safe & IPM Compliant
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-stone-400 block mb-1">System Guardrails:</span>
                  <div className="bg-stone-950/90 p-2 rounded text-xs text-stone-300 font-mono border border-stone-800 max-h-28 overflow-y-auto">
                    {currentPreset.groundedSystemPrompt}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-stone-400 block mb-1">Generated Output:</span>
                  <div className="bg-emerald-950/40 p-3 rounded text-xs text-emerald-100 leading-relaxed border border-emerald-800/50 max-h-40 overflow-y-auto whitespace-pre-line">
                    {currentPreset.groundedResponse}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/30 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Outcome:</strong> Prioritizes physical hygiene & IPM first, protects beneficial pollinators, and prevents chemical poisoning.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Playground Layout */
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">System Instructions & Guardrails</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsGroundedMode(!isGroundedMode);
                      setCustomSystemPrompt(
                        !isGroundedMode ? currentPreset.groundedSystemPrompt : currentPreset.badSystemPrompt
                      );
                    }}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> Toggle Guardrails
                  </button>
                </div>
              </div>
              <textarea
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                rows={7}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 font-mono focus:border-emerald-500 outline-none resize-none"
                placeholder="Enter system prompt instructions..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 mb-1.5 block">Farmer Query Input</label>
              <textarea
                value={customUserQuery}
                onChange={(e) => setCustomUserQuery(e.target.value)}
                rows={7}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:border-emerald-500 outline-none resize-none"
                placeholder="Enter what the farmer asks..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">
              Evaluates: Hallucination score, IPM priority, and chemical safety rules.
            </span>

            <button
              onClick={handleRunTest}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all shadow-md"
            >
              {isAnalyzing ? (
                <>Simulating Evaluation...</>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Run Agronomy Safety Test
                </>
              )}
            </button>
          </div>

          {simulatedOutput && (
            <div className="mt-4 p-4 rounded-xl border bg-stone-950 border-stone-800 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-3">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Evaluated AI Response
                </span>
                <span className="text-[11px] text-stone-400 font-mono">Simulated LLM Engine</span>
              </div>
              <p className="text-xs text-stone-200 whitespace-pre-line leading-relaxed font-sans">{simulatedOutput}</p>
            </div>
          )}
        </div>
      )}

      {/* Completion hook */}
      {hasTestedGrounded && (
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Prompt engineering lab completed! (+75 XP)
          </span>
          <button
            onClick={() => onComplete && onComplete()}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg transition-colors font-medium"
          >
            Continue Mission
          </button>
        </div>
      )}
    </div>
  );
}
