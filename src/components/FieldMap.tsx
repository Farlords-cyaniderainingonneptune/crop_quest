import { useState } from 'react';
import { 
  Award, 
  CalendarClock, 
  CheckCircle2, 
  ChevronRight, 
  CloudSunRain, 
  Compass, 
  Lock, 
  MapPin, 
  Play, 
  ScanEye, 
  ShieldCheck, 
  Sparkles, 
  Sprout, 
  Target, 
  Users, 
  Zap 
} from 'lucide-react';
import { Mission, UserProgress } from '../types';
import { sound } from '../utils/sound';

interface Props {
  missions: Mission[];
  progress: UserProgress;
  onSelectMission: (missionId: string) => void;
  onOpenCapstone: () => void;
}

export function FieldMap({ missions, progress, onSelectMission, onOpenCapstone }: Props) {
  const [filterView, setFilterView] = useState<'all' | 'pm' | 'ai'>('all');

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return Sprout;
      case 'Users': return Users;
      case 'Target': return Target;
      case 'CalendarClock': return CalendarClock;
      case 'Sparkles': return Sparkles;
      case 'ScanEye': return ScanEye;
      case 'CloudSunRain': return CloudSunRain;
      case 'ShieldCheck': return ShieldCheck;
      default: return Compass;
    }
  };

  const completedCount = progress.completedMissionIds.length;
  const totalMissions = missions.length;
  const progressPercent = Math.round((completedCount / totalMissions) * 100);

  // Growth Stage description
  const getFarmStage = (count: number) => {
    if (count === 0) return { title: 'Fallow Soil & Surveying', desc: 'Groundwork underway. Start Mission 1 to plant initial seeds.', emoji: '🌱' };
    if (count <= 2) return { title: 'Sprouting Seedlings', desc: 'Empathy roots established in Nakuru & Oyo.', emoji: '🌿' };
    if (count <= 4) return { title: 'Vegetative Canopy', desc: 'Agile sprints and North Star metrics flourishing.', emoji: '🌾' };
    if (count <= 7) return { title: 'Flowering & Fruiting', desc: 'AI computer vision and telemetry guarding yields.', emoji: '🌻' };
    return { title: 'Bountiful Harvest & Enterprise Scale', desc: 'All sectors operational! Capstone ready for pilot launch.', emoji: '🌳' };
  };

  const farmStage = getFarmStage(completedCount);

  return (
    <div className="space-y-6">
      {/* Farm Overview & Growth Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-6 text-stone-200 overflow-hidden relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>THE LIVING AGRI-TECH LEARNING MAP</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{completedCount} of {totalMissions} Sectors Mastered</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 flex items-center gap-2.5">
              <span>{farmStage.emoji}</span> Farm Stage: {farmStage.title}
            </h1>
            <p className="text-xs md:text-sm text-stone-400 max-w-xl">
              {farmStage.desc}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-mono text-stone-500">Overall Progress</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{progressPercent}%</div>
              <div className="w-24 h-1.5 bg-stone-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="h-9 w-px bg-stone-800" />

            <div>
              <div className="text-[10px] uppercase font-mono text-stone-500">Earned XP</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5 flex items-center gap-1">
                <Zap className="w-4 h-4 fill-current" /> {progress.totalXp}
              </div>
              <div className="text-[10px] text-stone-400 mt-1">Level {progress.level} Field Innovator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Segmented View */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => {
              sound.playClick();
              setFilterView('all');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterView === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All 8 Missions
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilterView('pm');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterView === 'pm'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            PM & Strategy (1-4)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilterView('ai');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterView === 'ai'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            AI & Field Tech (5-8)
          </button>
        </div>

        <span className="text-xs text-stone-400 font-mono hidden sm:inline">
          Click any sector to enter the field
        </span>
      </div>

      {/* Grid of Mission Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions
          .filter((m) => {
            if (filterView === 'pm') return m.number <= 4;
            if (filterView === 'ai') return m.number >= 5;
            return true;
          })
          .map((mission, idx) => {
            const isCompleted = progress.completedMissionIds.includes(mission.id);
            // First mission is always unlocked. Others unlocked if previous is completed or already finished
            const prevMissionId = missions[mission.number - 2]?.id;
            const isUnlocked =
              mission.number === 1 ||
              isCompleted ||
              (prevMissionId && progress.completedMissionIds.includes(prevMissionId));

            const Icon = getIcon(mission.icon);

            return (
              <div
                key={mission.id}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playClick();
                    onSelectMission(mission.id);
                  } else {
                    sound.playError();
                  }
                }}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-stone-900/90 border-emerald-600/50 hover:border-emerald-500 cursor-pointer shadow-sm shadow-emerald-950/20'
                    : isUnlocked
                    ? 'bg-stone-900 border-amber-600/40 hover:border-amber-400 cursor-pointer shadow-md'
                    : 'bg-stone-950/40 border-stone-850 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  {/* Top card tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                      Sector 0{mission.number}
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                      </span>
                    ) : isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono animate-pulse">
                        <Play className="w-3 h-3 fill-current" /> Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  {/* Header & Icon */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isCompleted
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400'
                          : isUnlocked
                          ? 'bg-stone-800 border-amber-500/50 text-amber-400'
                          : 'bg-stone-900 border-stone-800 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-bold font-serif text-base text-stone-100 leading-snug">
                        {mission.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
                        <MapPin className="w-3 h-3 text-stone-500" />
                        <span className="truncate">{mission.region}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 mt-3 line-clamp-2 leading-relaxed">
                    {mission.subtitle}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-mono">
                    Crop: <strong className="text-stone-300 font-sans">{mission.cropFocus.split(' ')[0]}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-current" /> +{mission.xpReward}
                    </span>

                    {isUnlocked && (
                      <ChevronRight className="w-4 h-4 text-stone-400 hover:text-stone-100 transition-transform" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Final Capstone Project Card */}
      <div
        onClick={() => {
          sound.playClick();
          onOpenCapstone();
        }}
        className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-emerald-950/40 border border-amber-600/40 hover:border-amber-400 cursor-pointer transition-all shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/50 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <span>FINAL INCUBATOR</span>
              <span>•</span>
              <span>DESIGN & PITCH YOUR OWN AI AGRI-PRODUCT</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-stone-100">
              The Capstone: Agricultural Venture Incubator
            </h2>
            <p className="text-xs md:text-sm text-stone-300 max-w-xl mt-1">
              Apply end-to-end learning: Select a crop, formulate a grounded AI model, set an outcome North Star, prioritize your sprint backlog, and draft an ethical field pilot.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all shadow-md shadow-amber-950">
            {progress.capstone?.completed ? 'Review Venture Brief' : 'Enter Incubator (+500 XP)'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
