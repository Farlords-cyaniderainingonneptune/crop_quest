import { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Download, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  Users, 
  Cpu, 
  Layers, 
  FileText 
} from 'lucide-react';
import { CapstoneProject } from '../types';
import { sound } from '../utils/sound';

interface Props {
  initialData?: CapstoneProject;
  onSave: (capstone: CapstoneProject) => void;
  onCompleteCapstone: (capstone: CapstoneProject) => void;
  learnerName: string;
}

const DEFAULT_CAPSTONE: CapstoneProject = {
  projectName: 'CassavaShield AI',
  regionAndCrop: 'Cassava (Manihot esculenta) in Oyo & Ogun States, Nigeria',
  farmerProblem: 'Cassava Mosaic Virus & Brown Streak Rot destroys up to 40% of smallholder tuber roots. Smallholders lack extension agents and cannot distinguish early leaf mosaic from simple nutrient deficiency.',
  userPersona: 'Baba Tunde (52 yrs), manages 3 acres of cassava, uses an affordable Android phone with intermittent 2G/3G network, prefers Yoruba or plain English voice instructions.',
  connectivityType: '3g_low_bandwidth',
  northStarMetric: 'Hectares of smallholder cassava planted with certified virus-free cuttings and harvested with zero rot loss.',
  aiApproach: 'edge_vision',
  promptOrModelSafety: 'On-device MobileNet/TFLite model runs offline in fields with 75% confidence threshold. If disease detected, provides sanitation steps (uproot and burn diseased stems). Strictly forbids unapproved chemical spraying for viral diseases.',
  riceBacklog: [
    { title: 'Offline leaf photo disease scanner', reach: 4500, impact: 3, confidence: 0.9, effort: 3, mustHave: true },
    { title: 'USSD *384# SMS virus outbreak heat alerts', reach: 6000, impact: 2, confidence: 0.8, effort: 2, mustHave: true },
    { title: 'Clean cutting supplier marketplace dispatch', reach: 3000, impact: 2, confidence: 0.7, effort: 3, mustHave: true },
    { title: 'Drone multispectral field health mapping', reach: 200, impact: 1, confidence: 0.5, effort: 6, mustHave: false },
  ],
  pilotPlanWeeks: 12,
  dataSovereigntyPolicy: 'Farmer GPS coordinates and yield data remain 100% property of the cooperative. No commercial sharing with chemical distributors without explicit cooperative vote.',
  completed: false,
};

export function CapstoneBuilder({ initialData, onSave, onCompleteCapstone, learnerName }: Props) {
  const [data, setData] = useState<CapstoneProject>(initialData || DEFAULT_CAPSTONE);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [report, setReport] = useState<CapstoneProject['feedbackReport'] | null>(
    initialData?.feedbackReport || null
  );

  const steps = [
    { num: 1, title: 'Problem & Persona', icon: Users },
    { num: 2, title: 'Strategy & North Star', icon: Target },
    { num: 3, title: 'AI & Safety Guardrails', icon: Cpu },
    { num: 4, title: 'Backlog & RICE MVP', icon: Layers },
    { num: 5, title: 'Pilot & Data Ethics', icon: ShieldAlert },
    { num: 6, title: 'Venture Review', icon: Award },
  ];

  const handleNextStep = () => {
    sound.playClick();
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    onSave(data);
  };

  const handlePrevStep = () => {
    sound.playClick();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateField = <K extends keyof CapstoneProject>(key: K, value: CapstoneProject[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRunEvaluation = () => {
    sound.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      // Dynamic intelligent evaluation rubric based on product choices
      const hasSafeAi = data.promptOrModelSafety.length > 30;
      const hasActionableNorthStar = data.northStarMetric.toLowerCase().includes('hectare') || 
                                     data.northStarMetric.toLowerCase().includes('harvest') ||
                                     data.northStarMetric.toLowerCase().includes('yield') ||
                                     data.northStarMetric.toLowerCase().includes('income') ||
                                     data.northStarMetric.toLowerCase().includes('protected');
      const hasClearPersona = data.userPersona.length > 25;
      const hasDataSovereignty = data.dataSovereigntyPolicy.toLowerCase().includes('cooperative') ||
                                  data.dataSovereigntyPolicy.toLowerCase().includes('consent') ||
                                  data.dataSovereigntyPolicy.toLowerCase().includes('anonym');

      const scores = {
        problemValidation: hasClearPersona ? 19 : 14,
        productPrioritization: 18,
        aiAppropriateness: hasSafeAi ? 20 : 15,
        ethicalSafety: hasDataSovereignty ? 19 : 13,
        pilotViability: data.pilotPlanWeeks >= 8 ? 19 : 12,
      };

      const totalScore = scores.problemValidation + scores.productPrioritization + scores.aiAppropriateness + scores.ethicalSafety + scores.pilotViability;

      const evalReport: CapstoneProject['feedbackReport'] = {
        overallVerdict: totalScore >= 85 ? 'Approved for Pilot Deployment (Grade A)' : 'Conditionally Approved with Field Revisions',
        dimensionScores: scores,
        strengths: [
          'High empathy for physical farm constraints (offline operation, daylight visibility, localized language).',
          'Avoided the vanity metric trap by anchoring success on protected hectares and farmer harvest integrity.',
          'Pragmatic MVP scoping: deferred expensive drone workflows in favor of accessible smartphone & USSD dispatch.',
          'Robust community data sovereignty policy protecting cooperative autonomy.',
        ],
        risksToAddress: [
          'Ensure agricultural extension agents are trained on false positive protocol before week 1 of planting.',
          'Verify battery drain behavior on low-end budget Android chipsets during continuous camera preview.',
        ],
        agronomistVerdict: `The agronomic design for ${data.projectName} demonstrates exceptional maturity. Combining on-device disease detection with clean planting cutting sourcing directly tackles the root cause of viral crop loss.`,
      };

      setReport(evalReport);
      const completedProject: CapstoneProject = {
        ...data,
        score: totalScore,
        feedbackReport: evalReport,
        completed: true,
        completedAt: new Date().toISOString(),
      };

      setData(completedProject);
      setIsSubmitting(false);
      sound.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      onCompleteCapstone(completedProject);
      setCurrentStep(6);
    }, 1200);
  };

  const handleDownloadBrief = () => {
    sound.playClick();
    const briefContent = `=====================================================
CROPQUEST AGRI-TECH PRODUCT SPECIFICATION & PILOT BRIEF
=====================================================
Product Name: ${data.projectName}
Product Lead: ${learnerName}
Target Crop & Region: ${data.regionAndCrop}
Date: ${new Date().toLocaleDateString()}
Status: Approved for Rural Field Pilot (Score: ${data.score || 95}/100)

1. PROBLEM DISCOVERY
--------------------
Farmer Pain: ${data.farmerProblem}
Target Persona: ${data.userPersona}
Field Connectivity: ${data.connectivityType}

2. PRODUCT STRATEGY & METRICS
-----------------------------
North Star Metric: ${data.northStarMetric}

3. AI ARCHITECTURE & SAFETY
---------------------------
Core AI Approach: ${data.aiApproach}
Safety & Guardrails: ${data.promptOrModelSafety}

4. MVP SPRINT BACKLOG (RICE)
----------------------------
${data.riceBacklog.map((item) => `- [${item.mustHave ? 'MUST' : 'COULD'}] ${item.title} (Reach: ${item.reach}, Impact: ${item.impact}x, Conf: ${item.confidence * 100}%, Effort: ${item.effort}w)`).join('\n')}

5. FIELD PILOT & DATA SOVEREIGNTY
---------------------------------
Pilot Timeline: ${data.pilotPlanWeeks} weeks
Data Sovereignty Charter: ${data.dataSovereigntyPolicy}

6. EXPERT EVALUATION
--------------------
Verdict: ${report?.overallVerdict || 'Grade A'}
Agronomist Sign-off: ${report?.agronomistVerdict || 'Endorsed for deployment.'}
=====================================================`;

    const blob = new Blob([briefContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.projectName.toLowerCase().replace(/\s+/g, '_')}_product_brief.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-8 text-stone-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" /> Capstone Project Incubator
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-100">
            Design Your AI Agri-Tech Product
          </h2>
          <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-2xl">
            Synthesize all 8 missions: Define a real smallholder problem, architect a safe AI engine, prioritize your MVP backlog, and structure an ethical rural pilot.
          </p>
        </div>

        {data.completed && (
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={handleDownloadBrief}
              className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3.5 py-2 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export Brief (.txt)
            </button>
          </div>
        )}
      </div>

      {/* Step Progress Stepper */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-6">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num || data.completed;

          return (
            <button
              key={s.num}
              onClick={() => {
                sound.playClick();
                setCurrentStep(s.num);
              }}
              className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                isActive
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : isDone
                  ? 'bg-stone-950/50 border-stone-800 text-stone-300 hover:border-stone-700'
                  : 'bg-stone-950/20 border-stone-900 text-stone-500'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-emerald-400' : isDone ? 'text-amber-400' : 'text-stone-600'}`} />
              <span className="text-[11px] font-medium truncate w-full">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="mt-6 min-h-[380px]">
        {/* Step 1: Problem & Persona */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Product Venture Name</label>
              <input
                type="text"
                value={data.projectName}
                onChange={(e) => updateField('projectName', e.target.value)}
                placeholder="e.g., KilimoPulse, CocoaGuard, CassavaShield AI"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">Target Crop & Geographic Region</label>
                <input
                  type="text"
                  value={data.regionAndCrop}
                  onChange={(e) => updateField('regionAndCrop', e.target.value)}
                  placeholder="e.g. Maize in Rift Valley, Kenya or Cocoa in Kumasi, Ghana"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs md:text-sm text-stone-100 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">Field Connectivity Context</label>
                <select
                  value={data.connectivityType}
                  onChange={(e) => updateField('connectivityType', e.target.value as CapstoneProject['connectivityType'])}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2 text-xs md:text-sm text-stone-100 focus:border-emerald-500 outline-none"
                >
                  <option value="2g_ussd">Basic Feature Phones / 2G USSD (*384#) only</option>
                  <option value="3g_low_bandwidth">Low-Cost Android / 3G Intermittent in Field</option>
                  <option value="smartphone_intermittent">Smartphones with Wi-Fi only at Cooperative Depot</option>
                  <option value="connected_hub">Connected Cooperative Hub with Solar Gateway</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Core Farmer Problem & Biological Urgency</label>
              <textarea
                value={data.farmerProblem}
                onChange={(e) => updateField('farmerProblem', e.target.value)}
                rows={3}
                placeholder="What destroys yield or wastes farmer capital? Why do existing solutions fail?"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs md:text-sm text-stone-100 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Farmer Persona & Daily Field Constraints</label>
              <textarea
                value={data.userPersona}
                onChange={(e) => updateField('userPersona', e.target.value)}
                rows={2}
                placeholder="Name, age, acreage, daylight habits, language literacy, trust in digital tools..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs md:text-sm text-stone-100 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Strategy & North Star */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Your North Star Metric (NSM)
              </label>
              <p className="text-[11px] text-stone-400 mb-2">
                Remember Mission 3: Avoid vanity metrics like "App downloads". Anchor on real farmer value exchange and harvest protection!
              </p>
              <input
                type="text"
                value={data.northStarMetric}
                onChange={(e) => updateField('northStarMetric', e.target.value)}
                placeholder="e.g. Hectares of smallholder cocoa protected from fungal rot with verified IPM compliance"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:border-emerald-500 outline-none font-medium"
              />
            </div>

            <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
              <span className="text-xs font-semibold text-emerald-400 block">Metric Hygiene Checklist</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Is it directly linked to farmer economic prosperity?</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Can it be measured before the end-of-year harvest?</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Does it discourage spamming useless notifications?</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Is it understandable to rural cooperative chairpersons?</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: AI Architecture & Safety */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Primary AI Technical Approach</label>
              <select
                value={data.aiApproach}
                onChange={(e) => updateField('aiApproach', e.target.value as CapstoneProject['aiApproach'])}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs md:text-sm text-stone-100 focus:border-emerald-500 outline-none"
              >
                <option value="edge_vision">Edge Computer Vision (Offline mobile camera disease/pest classifier)</option>
                <option value="llm_advisory">Multimodal GenAI Agronomy Advisor (Grounded voice/text extension)</option>
                <option value="satellite_predictive">Satellite Multispectral & Weather Predictive Engine</option>
                <option value="iot_sensor_rules">IoT Soil Sensor + Telemetry Rules Engine</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Agronomic Safety Guardrails & Model Confidence Policy
              </label>
              <p className="text-[11px] text-stone-400 mb-2">
                What happens when the model is unsure? How do you prevent dangerous chemical hallucinations or pesticide poisonings?
              </p>
              <textarea
                value={data.promptOrModelSafety}
                onChange={(e) => updateField('promptOrModelSafety', e.target.value)}
                rows={4}
                placeholder="Describe confidence thresholds (e.g., 75%), fallback to human extension agents, IPM biological preferences, and strict chemical dosage validation..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs md:text-sm text-stone-100 focus:border-emerald-500 outline-none font-mono"
              />
            </div>
          </div>
        )}

        {/* Step 4: Backlog & RICE MVP */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-stone-300">MVP Release Backlog & Scoping</label>
                <p className="text-[11px] text-stone-400">Mark features that MUST ship in the 4-week window before planting begins.</p>
              </div>
            </div>

            <div className="space-y-3">
              {data.riceBacklog.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-sm text-stone-100 block">{item.title}</span>
                    <span className="text-xs text-stone-400 font-mono">
                      Reach: {item.reach} | Impact: {item.impact}x | Conf: {Math.round(item.confidence * 100)}% | Effort: {item.effort} wks
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={item.mustHave}
                        onChange={(e) => {
                          const updated = [...data.riceBacklog];
                          updated[idx] = { ...item, mustHave: e.target.checked };
                          updateField('riceBacklog', updated);
                        }}
                        className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className={item.mustHave ? 'text-emerald-400 font-medium' : 'text-stone-500'}>
                        {item.mustHave ? 'Must-Have in MVP' : 'Post-Launch V2'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Pilot & Data Ethics */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Pilot Duration: {data.pilotPlanWeeks} Weeks (Full Phenological Cycle)
              </label>
              <input
                type="range"
                min="6"
                max="24"
                step="2"
                value={data.pilotPlanWeeks}
                onChange={(e) => updateField('pilotPlanWeeks', Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-stone-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
                <span>6 Weeks (Micro trial)</span>
                <span>12 Weeks (Vegetative to Harvest)</span>
                <span>24 Weeks (Two seasons)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Farmer Data Sovereignty & Commercial Protection Policy
              </label>
              <p className="text-[11px] text-stone-400 mb-2">
                Address Mission 8 ethics: Who owns the GPS points and yield logs? How are farmers shielded from predatory commercial exploitation?
              </p>
              <textarea
                value={data.dataSovereigntyPolicy}
                onChange={(e) => updateField('dataSovereigntyPolicy', e.target.value)}
                rows={4}
                placeholder="State the cooperative ownership model, explicit consent rules, and data anonymization protocol..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs md:text-sm text-stone-100 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 6: Evaluation & Venture Report */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            {!data.completed && !report ? (
              <div className="text-center py-8 bg-stone-950/60 border border-stone-800 rounded-xl p-6">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3 animate-pulse" />
                <h3 className="text-lg font-bold font-serif text-stone-100">Ready for Agricultural Venture Review</h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto mt-1 mb-5">
                  Submit your completed product specification to our AI PM & Agronomist evaluation engine.
                </p>
                <button
                  onClick={handleRunEvaluation}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-emerald-950"
                >
                  {isSubmitting ? 'Evaluating Product Architecture...' : 'Submit for Final Evaluation & Badge (+500 XP)'}
                </button>
              </div>
            ) : (
              report && (
                <div className="space-y-5">
                  {/* Verdict Banner */}
                  <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-stone-900 border border-emerald-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> CAPSTONE CERTIFICATION EARNED
                      </div>
                      <h3 className="text-xl font-bold font-serif text-stone-100 mt-1">
                        {data.projectName}: {report.overallVerdict}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1">
                        Product Lead: <strong className="text-stone-200">{learnerName}</strong> · Evaluated by CropQuest Lab Board
                      </p>
                    </div>

                    <div className="text-right self-end sm:self-center">
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-mono">Mastery Score</span>
                      <span className="text-3xl font-bold font-mono text-amber-400">{data.score || 95}/100</span>
                    </div>
                  </div>

                  {/* 5-Dimension Scorecard */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {Object.entries(report.dimensionScores).map(([key, val]) => (
                      <div key={key} className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-center">
                        <span className="text-[10px] uppercase font-mono text-stone-500 block truncate">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                          {val} / 20
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Agronomist Sign-off & Strengths */}
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-xs font-mono uppercase text-stone-500 block mb-1">Lead Agronomist Review</span>
                    <p className="text-xs text-stone-200 italic leading-relaxed">
                      "{report.agronomistVerdict}"
                    </p>

                    <div className="mt-4 pt-3 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-emerald-400 block mb-1">Key Strengths</span>
                        <ul className="space-y-1 text-stone-300">
                          {report.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-semibold text-amber-400 block mb-1">Pilot Watchpoints</span>
                        <ul className="space-y-1 text-stone-300">
                          {report.risksToAddress.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-500">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 pt-5 border-t border-stone-800 flex items-center justify-between">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 text-xs md:text-sm font-medium text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Previous Step
        </button>

        <div className="flex items-center gap-3">
          {currentStep < 6 && (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all shadow-md"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 6 && data.completed && (
            <button
              onClick={handleDownloadBrief}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all shadow-md"
            >
              <FileText className="w-4 h-4" /> Export Product Deck
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
