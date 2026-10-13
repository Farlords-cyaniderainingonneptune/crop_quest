import { Award, BookOpen, Volume2, VolumeX, Wrench, Sprout, User } from 'lucide-react';
import { UserProgress } from '../types';
import { calculateLevel } from '../utils/storage';
import { sound } from '../utils/sound';

interface Props {
  progress: UserProgress;
  onOpenProfile: () => void;
  onOpenGlossary: () => void;
  onOpenSandbox: () => void;
  onToggleSound: () => void;
  onGoHome: () => void;
}

export function Navbar({
  progress,
  onOpenProfile,
  onOpenGlossary,
  onOpenSandbox,
  onToggleSound,
  onGoHome,
}: Props) {
  const levelInfo = calculateLevel(progress.totalXp);
  const xpInCurrentLevel = progress.totalXp - levelInfo.prevLevelXp;
  const xpNeededForCurrentLevel = levelInfo.nextLevelXp - levelInfo.prevLevelXp;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForCurrentLevel) * 100));

  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950 group-hover:bg-emerald-500 transition-colors">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-bold text-base md:text-lg text-stone-100 flex items-center gap-1.5 leading-none">
              <span>CropQuest</span>
              <span className="text-[10px] font-sans font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                AI & AGRI LAB
              </span>
            </div>
            <span className="text-[11px] text-stone-400 hidden sm:block mt-0.5">
              Project & Product Management in Agriculture
            </span>
          </div>
        </button>

        {/* Right Action Tools & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP & Level Widget */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2.5 bg-stone-950/80 hover:bg-stone-800/80 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-800 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
              L{levelInfo.level}
            </div>

            <div className="hidden md:block">
              <div className="text-[11px] font-semibold text-stone-200 leading-tight">
                {levelInfo.title}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">
                {progress.totalXp} XP · {progressPercent}% to L{levelInfo.level + 1}
              </div>
            </div>

            <div className="w-12 h-1.5 bg-stone-800 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </button>

          {/* Interactive Tools Sandbox Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSandbox();
            }}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors"
            title="Interactive Tools Sandbox"
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Tools Sandbox</span>
          </button>

          {/* Field Glossary */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenGlossary();
            }}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors"
            title="Handbook & Glossary"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="hidden lg:inline">Handbook</span>
          </button>

          {/* Badges / Cabinet button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-amber-400 transition-colors"
            title="Badges & Profile"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Audio toggle button */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
            title={progress.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
