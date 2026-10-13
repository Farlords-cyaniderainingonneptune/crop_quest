import { UserProgress } from '../types';

const STORAGE_KEY = 'cropquest_user_progress_v1';

export const INITIAL_USER_PROGRESS: UserProgress = {
  learnerName: 'Field Innovator',
  totalXp: 0,
  level: 1,
  currentMissionId: 'mission-1',
  completedMissionIds: [],
  unlockedBadgeIds: ['badge-orientation'],
  stageProgress: {
    'mission-1': 0,
  },
  completedStages: {},
  soundEnabled: true,
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_USER_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_USER_PROGRESS,
      ...parsed,
      stageProgress: {
        ...INITIAL_USER_PROGRESS.stageProgress,
        ...(parsed.stageProgress || {}),
      },
      completedStages: {
        ...INITIAL_USER_PROGRESS.completedStages,
        ...(parsed.completedStages || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load user progress from storage', e);
    return INITIAL_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
}

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; prevLevelXp: number } {
  if (xp < 250) {
    return { level: 1, title: 'Seed Sower', nextLevelXp: 250, prevLevelXp: 0 };
  } else if (xp < 600) {
    return { level: 2, title: 'Field Scout', nextLevelXp: 600, prevLevelXp: 250 };
  } else if (xp < 1100) {
    return { level: 3, title: 'Agri Product Explorer', nextLevelXp: 1100, prevLevelXp: 600 };
  } else if (xp < 1800) {
    return { level: 4, title: 'Sprint Agronomist', nextLevelXp: 1800, prevLevelXp: 1100 };
  } else if (xp < 2600) {
    return { level: 5, title: 'AI Field Architect', nextLevelXp: 2600, prevLevelXp: 1800 };
  } else {
    return { level: 6, title: 'Agri-Tech Principal PM', nextLevelXp: 3500, prevLevelXp: 2600 };
  }
}
