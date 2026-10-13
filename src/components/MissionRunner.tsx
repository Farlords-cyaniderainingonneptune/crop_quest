import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  MapPin, 
  Sparkles, 
  Trophy, 
  XCircle, 
  Zap 
} from 'lucide-react';
import { Mission, MissionStage, ScenarioChoice } from '../types';
import { sound } from '../utils/sound';
import { RiceMatrixTool } from './interactive/RiceMatrixTool';
import { PromptLabTool } from './interactive/PromptLabTool';
import { VisionThresholdTool } from './interactive/VisionThresholdTool';
import { IrrigationDecisionTool } from './interactive/IrrigationDecisionTool';

interface Props {
  mission: Mission;
  initialStageIndex?: number;
  onCompleteStage: (missionId: string, stageId: string, earnedXp: number) => void;
  onCompleteMission: (missionId: string, totalXp: number, badgeId: string) => void;
  onBackToMap: () => void;
}

export function MissionRunner({
  mission,
  initialStageIndex = 0,
  onCompleteStage,
  onCompleteMission,
  onBackToMap,
}: Props) {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(initialStageIndex);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [selectedQuizOptionId, setSelectedQuizOptionId] = useState<string | null>(null);
  const [hasCompletedCurrentStage, setHasCompletedCurrentStage] = useState<boolean>(false);
  const [stageEarnedXp, setStageEarnedXp] = useState<number>(0);

  const stage: MissionStage = mission.stages[currentStageIdx] || mission.stages[0];
  const isLastStage = currentStageIdx === mission.stages.length - 1;

  // Handle Scenario Choice
  const handleSelectChoice = (choice: ScenarioChoice) => {
    if (selectedChoiceId) return; // already made choice for this stage attempt
    sound.playClick();
    setSelectedChoiceId(choice.id);
    setHasCompletedCurrentStage(true);

    const xp = choice.xp;
    setStageEarnedXp(xp);

    if (choice.isOptimal) {
      sound.playSuccess();
    } else {
      sound.playError();
    }

    onCompleteStage(mission.id, stage.id, xp);
  };

  // Handle Quiz Option
  const handleSelectQuiz = (optionId: string, isCorrect: boolean) => {
    if (selectedQuizOptionId) return;
    setSelectedQuizOptionId(optionId);
    setHasCompletedCurrentStage(true);

    if (isCorrect) {
      sound.playSuccess();
      setStageEarnedXp(60);
      onCompleteStage(mission.id, stage.id, 60);
    } else {
      sound.playError();
      setStageEarnedXp(20);
      onCompleteStage(mission.id, stage.id, 20);
    }
  };

  // Move to next stage or finish mission
  const handleNext = () => {
    sound.playClick();
    if (isLastStage) {
      sound.playLevelUp();
      onCompleteMission(mission.id, mission.xpReward, mission.badgeId);
    } else {
      setCurrentStageIdx((prev) => prev + 1);
      setSelectedChoiceId(null);
      setSelectedQuizOptionId(null);
      setHasCompletedCurrentStage(false);
      setStageEarnedXp(0);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStageIdx > 0) {
      setCurrentStageIdx((prev) => prev - 1);
      setSelectedChoiceId(null);
      setSelectedQuizOptionId(null);
      setHasCompletedCurrentStage(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Mission Header Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-6 text-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMap}
              className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-100 hover:border-stone-700 transition-colors"
              title="Return to Field Map"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span>{mission.sectorName}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-stone-400">
                  <MapPin className="w-3 h-3" /> {mission.region}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-100 mt-0.5">
                Mission {mission.number}: {mission.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">Mission Reward</span>
              <span className="text-sm font-bold font-mono text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" /> +{mission.xpReward} XP
              </span>
            </div>
          </div>
        </div>

        {/* Stage Progress Stepper */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {mission.stages.map((st, idx) => {
              const isCurrent = idx === currentStageIdx;
              const isPast = idx < currentStageIdx;
              return (
                <div key={st.id} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-emerald-500'
                        : isPast
                        ? 'bg-emerald-800/80'
                        : 'bg-stone-800'
                    }`}
                  />
                  <div className="text-[10px] text-stone-400 mt-1 truncate hidden sm:block">
                    Stage {idx + 1}: {st.title.split(':')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          <span className="text-xs font-mono text-stone-400 shrink-0 ml-2">
            Stage {currentStageIdx + 1} of {mission.stages.length}
          </span>
        </div>
      </div>

      {/* Main Stage Card Content */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 text-stone-200 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-6">
          {/* Stage Subhead */}
          <div className="border-b border-stone-800/80 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                {stage.type.toUpperCase()}
              </span>
              {stage.badgeKicker && (
                <span className="text-xs text-stone-400">• {stage.badgeKicker}</span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-stone-100">
              {stage.title}
            </h2>
            {stage.subtitle && (
              <p className="text-xs md:text-sm text-stone-400 mt-1">{stage.subtitle}</p>
            )}
          </div>

          {/* STAGE TYPE: CONCEPT */}
          {stage.type === 'concept' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-3">
                {stage.content.map((paragraph, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 text-xs md:text-sm text-stone-200 leading-relaxed flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{paragraph}</span>
                  </div>
                ))}
              </div>

              {stage.keyTakeaway && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-600/40 text-xs md:text-sm text-emerald-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 font-sans block text-xs uppercase tracking-wider mb-0.5">
                      The Agronomic PM Principle
                    </strong>
                    <span>{stage.keyTakeaway}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE TYPE: SCENARIO */}
          {stage.type === 'scenario' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stakeholder Dialogue Box */}
              {stage.stakeholder && (
                <div className="p-4 md:p-5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${stage.stakeholder.avatarBg} text-white font-bold flex items-center justify-center shrink-0 shadow-md`}
                  >
                    {stage.stakeholder.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-100 text-sm md:text-base">
                        {stage.stakeholder.name}
                      </h4>
                      <span className="text-xs text-stone-400">• {stage.stakeholder.role}</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono block mb-2">
                      {stage.stakeholder.location}
                    </span>
                    <blockquote className="text-xs md:text-sm text-stone-200 italic border-l-2 border-amber-500 pl-3">
                      "{stage.stakeholder.quote}"
                    </blockquote>
                  </div>
                </div>
              )}

              {/* Scenario Context */}
              <div className="space-y-2 text-xs md:text-sm text-stone-300 leading-relaxed">
                {stage.content.map((text, idx) => (
                  <p key={idx}>{text}</p>
                ))}
              </div>

              {/* Decision Choices */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block font-mono">
                  What decision will you make as Product Manager?
                </span>

                {stage.scenarioChoices?.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  const showFeedback = selectedChoiceId !== null;

                  return (
                    <div
                      key={choice.id}
                      onClick={() => handleSelectChoice(choice)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? choice.isOptimal
                            ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950'
                            : 'bg-red-950/40 border-red-500'
                          : showFeedback
                          ? 'bg-stone-950/30 border-stone-800/40 opacity-60'
                          : 'bg-stone-950/70 border-stone-800 hover:border-emerald-700/60 hover:bg-stone-950'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 border ${
                              isSelected
                                ? choice.isOptimal
                                  ? 'bg-emerald-600 border-emerald-400 text-white'
                                  : 'bg-red-600 border-red-400 text-white'
                                : 'bg-stone-800 border-stone-700 text-stone-400'
                            }`}
                          >
                            {isSelected ? (choice.isOptimal ? '✓' : '✕') : '•'}
                          </span>
                          <div>
                            <h5 className="font-semibold text-stone-100 text-xs md:text-sm">
                              {choice.title}
                            </h5>
                            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                              {choice.actionText}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-xs font-bold font-mono text-amber-400 shrink-0">
                            +{choice.xp} XP
                          </span>
                        )}
                      </div>

                      {/* Instant Detailed Feedback & Explanations */}
                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-stone-800/80 space-y-2 text-xs">
                          <div
                            className={`p-3 rounded-lg ${
                              choice.isOptimal
                                ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-800/50'
                                : 'bg-amber-950/60 text-amber-200 border border-amber-800/50'
                            }`}
                          >
                            <strong>Outcome: </strong> {choice.consequence}
                            <p className="mt-1 text-stone-300">{choice.explanation}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                            <div className="bg-stone-900 p-2.5 rounded border border-stone-800">
                              <span className="text-emerald-400 font-semibold block mb-0.5">Upsides:</span>
                              <ul className="list-disc list-inside text-stone-300 space-y-0.5">
                                {choice.tradeOffs.pros.map((p, i) => (
                                  <li key={i}>{p}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-stone-900 p-2.5 rounded border border-stone-800">
                              <span className="text-amber-400 font-semibold block mb-0.5">Trade-offs & Risks:</span>
                              <ul className="list-disc list-inside text-stone-300 space-y-0.5">
                                {choice.tradeOffs.cons.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STAGE TYPE: INTERACTIVE TOOL */}
          {stage.type === 'interactive-tool' && (
            <div className="space-y-4 animate-fadeIn">
              {stage.interactiveToolType === 'rice-matrix' && (
                <RiceMatrixTool onComplete={() => setHasCompletedCurrentStage(true)} />
              )}
              {stage.interactiveToolType === 'prompt-lab' && (
                <PromptLabTool onComplete={() => setHasCompletedCurrentStage(true)} />
              )}
              {stage.interactiveToolType === 'vision-threshold' && (
                <VisionThresholdTool onComplete={() => setHasCompletedCurrentStage(true)} />
              )}
              {stage.interactiveToolType === 'irrigation-decision' && (
                <IrrigationDecisionTool onComplete={() => setHasCompletedCurrentStage(true)} />
              )}
            </div>
          )}

          {/* STAGE TYPE: QUIZ */}
          {stage.type === 'quiz' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <HelpCircle className="w-4 h-4" /> Conceptual Verification
                </div>
                <h3 className="text-sm md:text-base font-semibold text-stone-100">
                  {stage.quizQuestion}
                </h3>
              </div>

              <div className="space-y-3">
                {stage.quizOptions?.map((opt) => {
                  const isSelected = selectedQuizOptionId === opt.id;
                  const showFeedback = selectedQuizOptionId !== null;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectQuiz(opt.id, opt.isCorrect)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500'
                            : 'bg-red-950/40 border-red-500'
                          : showFeedback
                          ? opt.isCorrect
                            ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                            : 'bg-stone-950/30 border-stone-800/40 opacity-50'
                          : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 border ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-emerald-600 border-emerald-400 text-white'
                                : 'bg-red-600 border-red-400 text-white'
                              : 'bg-stone-800 border-stone-700 text-stone-400'
                          }`}
                        >
                          {isSelected ? (opt.isCorrect ? '✓' : '✕') : '•'}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs md:text-sm text-stone-200">{opt.text}</p>
                          {showFeedback && (
                            <p
                              className={`text-xs mt-2 p-2.5 rounded ${
                                opt.isCorrect
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                  : 'bg-red-950/40 text-red-300 border border-red-900/40'
                              }`}
                            >
                              <strong>{opt.isCorrect ? 'Why this is correct:' : 'Why this is a trap:'}</strong>{' '}
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="mt-8 pt-5 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStageIdx === 0}
            className="px-4 py-2 text-xs md:text-sm font-medium text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-3">
            {stageEarnedXp > 0 && (
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> +{stageEarnedXp} XP Earned
              </span>
            )}

            <button
              onClick={handleNext}
              disabled={
                (stage.type === 'scenario' && !selectedChoiceId) ||
                (stage.type === 'quiz' && !selectedQuizOptionId)
              }
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                isLastStage
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isLastStage ? (
                <>
                  <Award className="w-4 h-4" /> Complete Mission & Claim Badge
                </>
              ) : (
                <>
                  Next Stage <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
