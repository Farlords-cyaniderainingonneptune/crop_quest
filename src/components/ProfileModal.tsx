import { useState } from 'react';
import { 
  Award, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  RotateCcw, 
  Save, 
  Trophy, 
  X, 
  Zap, 
  FileCheck 
} from 'lucide-react';
import { BADGES } from '../data/badges';
import { UserProgress } from '../types';
import { calculateLevel } from '../utils/storage';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateLearnerName: (name: string) => void;
  onResetProgress: () => void;
  onViewCertificate: () => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  progress,
  onUpdateLearnerName,
  onResetProgress,
  onViewCertificate,
}: Props) {
  const [nameInput, setNameInput] = useState(progress.learnerName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const levelInfo = calculateLevel(progress.totalXp);
  const unlockedBadgesCount = progress.unlockedBadgeIds.length;
  const isCapstoneCompleted = progress.capstone?.completed;

  const handleSaveName = () => {
    sound.playClick();
    if (nameInput.trim()) {
      onUpdateLearnerName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-stone-200 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-100">Learner Profile & Trophy Room</h2>
              <p className="text-xs text-stone-400">Track your agri-tech competency and unlocked credentials</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-stone-900 border border-emerald-500 rounded px-2.5 py-1 text-sm text-stone-100 outline-none"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs"
                    title="Save Name"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-stone-100">{progress.learnerName}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Edit Name
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs font-mono text-emerald-400">
              Rank: <strong className="text-amber-300 font-sans">{levelInfo.title}</strong> (Level {levelInfo.level})
            </div>
          </div>

          <div className="flex items-center gap-4 bg-stone-900 px-4 py-2.5 rounded-xl border border-stone-800">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Accumulated XP</span>
              <span className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1">
                <Zap className="w-4 h-4 fill-current" /> {progress.totalXp}
              </span>
            </div>

            <div className="h-7 w-px bg-stone-800" />

            <div>
              <span className="text-[10px] text-stone-500 uppercase font-mono block">Missions Done</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {progress.completedMissionIds.length} / 8
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Button if Capstone Done */}
        {isCapstoneCompleted && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-emerald-950/40 border border-amber-600/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-stone-100">Official Certificate of Completion Available</h4>
                <p className="text-xs text-stone-300">Issued for passing the Agri-Tech Venture Capstone project.</p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onViewCertificate();
              }}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <FileCheck className="w-4 h-4" /> View Certificate
            </button>
          </div>
        )}

        {/* Badges Cabinet */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider font-mono">
              Badge Cabinet ({unlockedBadgesCount} / {BADGES.length} Unlocked)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((badge) => {
              const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-stone-950/80 border-amber-500/40 shadow-sm'
                      : 'bg-stone-950/30 border-stone-850 opacity-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isUnlocked
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-600'
                    }`}
                  >
                    {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${isUnlocked ? 'text-stone-100' : 'text-stone-500'}`}>
                        {badge.title}
                      </h4>
                      <span className="text-[10px] font-mono text-amber-400 shrink-0">
                        +{badge.xpValue} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-red-400">Are you sure? All progress will reset.</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="bg-red-700 hover:bg-red-600 text-white px-2.5 py-1 rounded text-xs"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="text-stone-400 hover:text-stone-200 text-xs ml-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-stone-500 hover:text-red-400 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset My Progress
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-1.5 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
