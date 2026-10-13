export type StageType = 'concept' | 'scenario' | 'interactive-tool' | 'quiz';

export interface FarmerStakeholder {
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarText: string;
  avatarBg: string;
}

export interface ScenarioChoice {
  id: string;
  title: string;
  actionText: string;
  consequence: string;
  explanation: string;
  xp: number;
  isOptimal: boolean;
  tradeOffs: {
    pros: string[];
    cons: string[];
  };
}

export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
  isCorrect: boolean;
}

export interface MissionStage {
  id: string;
  type: StageType;
  title: string;
  subtitle?: string;
  badgeKicker?: string;
  content: string[]; // key bullet/paragraph insights
  keyTakeaway?: string;
  stakeholder?: FarmerStakeholder;
  scenarioChoices?: ScenarioChoice[];
  quizQuestion?: string;
  quizOptions?: QuizOption[];
  interactiveToolType?: 'rice-matrix' | 'prompt-lab' | 'vision-threshold' | 'irrigation-decision';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'pm' | 'ai' | 'field' | 'mastery';
  xpValue: number;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  sectorName: string;
  cropFocus: string;
  region: string;
  icon: string;
  xpReward: number;
  badgeId: string;
  overview: string;
  learningOutcomes: string[];
  stages: MissionStage[];
}

export interface CapstoneProject {
  projectName: string;
  regionAndCrop: string;
  farmerProblem: string;
  userPersona: string;
  connectivityType: '2g_ussd' | '3g_low_bandwidth' | 'smartphone_intermittent' | 'connected_hub';
  northStarMetric: string;
  aiApproach: 'edge_vision' | 'llm_advisory' | 'satellite_predictive' | 'iot_sensor_rules';
  promptOrModelSafety: string;
  riceBacklog: Array<{
    title: string;
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    mustHave: boolean;
  }>;
  pilotPlanWeeks: number;
  dataSovereigntyPolicy: string;
  score?: number;
  feedbackReport?: {
    overallVerdict: string;
    dimensionScores: {
      problemValidation: number;
      productPrioritization: number;
      aiAppropriateness: number;
      ethicalSafety: number;
      pilotViability: number;
    };
    strengths: string[];
    risksToAddress: string[];
    agronomistVerdict: string;
  };
  completed: boolean;
  completedAt?: string;
}

export interface UserProgress {
  learnerName: string;
  totalXp: number;
  level: number;
  currentMissionId: string;
  completedMissionIds: string[];
  unlockedBadgeIds: string[];
  stageProgress: Record<string, number>; // missionId -> current stage index
  completedStages: Record<string, string[]>; // missionId -> array of stageIds
  soundEnabled: boolean;
  capstone?: CapstoneProject;
}

export interface GlossaryTerm {
  term: string;
  category: 'PM' | 'AI & ML' | 'Agri-Tech' | 'Field & Ethics';
  definition: string;
  example: string;
}
