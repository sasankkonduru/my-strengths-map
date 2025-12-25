export type Domain = 'executing' | 'influencing' | 'relationship' | 'strategic';

export interface Strength {
  id: string;
  name: string;
  domain: Domain;
  description: string;
  keyBehaviors: string[];
  inAction: string;
  blindSpots: string;
  tips: string[];
}

export interface Question {
  id: number;
  strengthId: string;
  text: string;
}

export interface AssessmentAnswer {
  questionId: number;
  value: number; // 1-5
}

export interface AssessmentProgress {
  currentQuestionIndex: number;
  answers: AssessmentAnswer[];
  startedAt: string;
  completedAt?: string;
}

export interface StrengthScore {
  strengthId: string;
  strength: Strength;
  score: number; // 5-25
  rank: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  scores: StrengthScore[];
  completedAt: string;
  domainScores: Record<Domain, number>;
}

export interface User {
  id: string;
  name: string;
  createdAt: string;
}
