/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { MISSIONS } from './data/missions';
import { BADGES } from './data/badges';
import { CapstoneProject, UserProgress } from './types';
import { loadUserProgress, saveUserProgress, calculateLevel } from './utils/storage';
import { sound } from './utils/sound';
import { Navbar } from './components/Navbar';
import { FieldMap } from './components/FieldMap';
import { MissionRunner } from './components/MissionRunner';
import { CapstoneBuilder } from './components/CapstoneBuilder';
import { ProfileModal } from './components/ProfileModal';
import { GlossaryModal } from './components/GlossaryModal';
import { CertificateModal } from './components/CertificateModal';
import { ToolsSandboxModal } from './components/ToolsSandboxModal';
import { Award, CheckCircle2, Zap } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [activeView, setActiveView] = useState<'map' | 'mission' | 'capstone'>('map');
  const [activeMissionId, setActiveMissionId] = useState<string>('mission-1');

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Toast / Milestone celebration banner
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    description: string;
    type: 'xp' | 'badge' | 'mission';
  } | null>(null);

  // Sync progress to localStorage
  useEffect(() => {
    saveUserProgress(progress);
    sound.setEnabled(progress.soundEnabled);
  }, [progress]);

  const showToast = (title: string, description: string, type: 'xp' | 'badge' | 'mission') => {
    setToastNotification({ title, description, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = !progress.soundEnabled;
    sound.setEnabled(nextState);
    if (nextState) sound.playClick();
    setProgress((prev) => ({ ...prev, soundEnabled: nextState }));
  };

  // Select mission from field map
  const handleSelectMission = (missionId: string) => {
    setActiveMissionId(missionId);
    setActiveView('mission');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stage completion handler
  const handleCompleteStage = (missionId: string, stageId: string, earnedXp: number) => {
    setProgress((prev) => {
      const currentCompletedStages = prev.completedStages[missionId] || [];
      const isAlreadyCompleted = currentCompletedStages.includes(stageId);
      const newXp = isAlreadyCompleted ? prev.totalXp : prev.totalXp + earnedXp;

      const updated = {
        ...prev,
        totalXp: newXp,
        level: calculateLevel(newXp).level,
        completedStages: {
          ...prev.completedStages,
          [missionId]: isAlreadyCompleted
            ? currentCompletedStages
            : [...currentCompletedStages, stageId],
        },
      };

      if (!isAlreadyCompleted && earnedXp > 0) {
        showToast(`+${earnedXp} XP Earned!`, 'Stage objective mastered.', 'xp');
      }

      return updated;
    });
  };

  // Mission completion handler
  const handleCompleteMission = (missionId: string, totalXpReward: number, badgeId: string) => {
    setProgress((prev) => {
      const isAlreadyCompleted = prev.completedMissionIds.includes(missionId);
      const newCompleted = isAlreadyCompleted
        ? prev.completedMissionIds
        : [...prev.completedMissionIds, missionId];
      const newBadges = prev.unlockedBadgeIds.includes(badgeId)
        ? prev.unlockedBadgeIds
        : [...prev.unlockedBadgeIds, badgeId];
      const newXp = isAlreadyCompleted ? prev.totalXp : prev.totalXp + totalXpReward;

      const badgeObj = BADGES.find((b) => b.id === badgeId);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });

      showToast(
        `Mission Mastered! Badge Unlocked: ${badgeObj?.title || 'Sector Pioneer'}`,
        `+${totalXpReward} XP awarded for advancing smallholder agricultural innovation.`,
        'mission'
      );

      return {
        ...prev,
        totalXp: newXp,
        level: calculateLevel(newXp).level,
        completedMissionIds: newCompleted,
        unlockedBadgeIds: newBadges,
      };
    });

    setActiveView('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Capstone project saving & completion
  const handleSaveCapstone = (capstone: CapstoneProject) => {
    setProgress((prev) => ({
      ...prev,
      capstone,
    }));
  };

  const handleCompleteCapstone = (capstone: CapstoneProject) => {
    setProgress((prev) => {
      const capstoneBadge = 'badge-capstone';
      const newBadges = prev.unlockedBadgeIds.includes(capstoneBadge)
        ? prev.unlockedBadgeIds
        : [...prev.unlockedBadgeIds, capstoneBadge];
      const newXp = prev.totalXp + 500;

      showToast(
        'Venture Incubator Completed! Badge: Agri-Tech Venture Architect',
        '+500 XP conferred for passing your capstone evaluation.',
        'badge'
      );

      return {
        ...prev,
        totalXp: newXp,
        level: calculateLevel(newXp).level,
        unlockedBadgeIds: newBadges,
        capstone,
      };
    });
  };

  // Reset progress
  const handleResetProgress = () => {
    localStorage.removeItem('cropquest_user_progress_v1');
    setProgress({
      learnerName: 'Field Innovator',
      totalXp: 0,
      level: 1,
      currentMissionId: 'mission-1',
      completedMissionIds: [],
      unlockedBadgeIds: ['badge-orientation'],
      stageProgress: { 'mission-1': 0 },
      completedStages: {},
      soundEnabled: true,
    });
    setActiveView('map');
    showToast('Progress Reset', 'Your field journey has been reset to Sector 1.', 'xp');
  };

  const activeMission = MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-stone-900 border border-emerald-500/70 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-fadeIn">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shrink-0">
            {toastNotification.type === 'xp' ? (
              <Zap className="w-4 h-4 fill-current text-amber-400" />
            ) : (
              <Award className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-100">{toastNotification.title}</h4>
            <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
              {toastNotification.description}
            </p>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        progress={progress}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onToggleSound={handleToggleSound}
        onGoHome={() => setActiveView('map')}
      />

      {/* Main Learning Hub Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeView === 'map' && (
          <FieldMap
            missions={MISSIONS}
            progress={progress}
            onSelectMission={handleSelectMission}
            onOpenCapstone={() => {
              setActiveView('capstone');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'mission' && (
          <MissionRunner
            mission={activeMission}
            initialStageIndex={0}
            onCompleteStage={handleCompleteStage}
            onCompleteMission={handleCompleteMission}
            onBackToMap={() => setActiveView('map')}
          />
        )}

        {activeView === 'capstone' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <button
              onClick={() => setActiveView('map')}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1.5 transition-colors mb-2"
            >
              ← Back to Field Map
            </button>
            <CapstoneBuilder
              initialData={progress.capstone}
              onSave={handleSaveCapstone}
              onCompleteCapstone={handleCompleteCapstone}
              learnerName={progress.learnerName}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        progress={progress}
        onUpdateLearnerName={(name) => setProgress((p) => ({ ...p, learnerName: name }))}
        onResetProgress={handleResetProgress}
        onViewCertificate={() => {
          setIsProfileOpen(false);
          setIsCertificateOpen(true);
        }}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <ToolsSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        progress={progress}
      />

      {/* Footer */}
      <footer className="border-t border-stone-850 py-6 px-4 text-center text-xs text-stone-500 bg-stone-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-400 font-serif">CropQuest</span>
            <span>· AI & Agri Project Lab</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={() => setIsGlossaryOpen(true)} className="hover:text-stone-200 transition-colors">
              Field Handbook
            </button>
            <button onClick={() => setIsSandboxOpen(true)} className="hover:text-stone-200 transition-colors">
              Simulation Sandbox
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="hover:text-stone-200 transition-colors">
              Badges ({progress.unlockedBadgeIds.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
