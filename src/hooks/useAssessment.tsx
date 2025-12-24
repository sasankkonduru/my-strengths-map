import { useState, useEffect, useCallback } from 'react';
import { AssessmentProgress, AssessmentAnswer, AssessmentResult, StrengthScore, Domain } from '@/types/strengths';
import { QUESTIONS } from '@/data/questions';
import { STRENGTHS, getStrengthById } from '@/data/strengths';
import { useAuth } from './useAuth';

const PROGRESS_KEY = 'strengths_insight_progress';
const RESULTS_KEY = 'strengths_insight_results';

export function useAssessment() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<AssessmentProgress | null>(null);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserProgressKey = useCallback(() => {
    return user ? `${PROGRESS_KEY}_${user.id}` : null;
  }, [user]);

  const getUserResultsKey = useCallback(() => {
    return user ? `${RESULTS_KEY}_${user.id}` : null;
  }, [user]);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setResults(null);
      setIsLoading(false);
      return;
    }

    const progressKey = getUserProgressKey();
    const resultsKey = getUserResultsKey();

    if (progressKey) {
      try {
        const storedProgress = localStorage.getItem(progressKey);
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }
      } catch {
        // Ignore parse errors
      }
    }

    if (resultsKey) {
      try {
        const storedResults = localStorage.getItem(resultsKey);
        if (storedResults) {
          setResults(JSON.parse(storedResults));
        }
      } catch {
        // Ignore parse errors
      }
    }

    setIsLoading(false);
  }, [user, getUserProgressKey, getUserResultsKey]);

  const startAssessment = useCallback(() => {
    if (!user) return;

    const newProgress: AssessmentProgress = {
      currentQuestionIndex: 0,
      answers: [],
      startedAt: new Date().toISOString(),
    };

    setProgress(newProgress);
    const key = getUserProgressKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(newProgress));
    }
  }, [user, getUserProgressKey]);

  const answerQuestion = useCallback((questionId: number, value: number) => {
    if (!progress || !user) return;

    const existingIndex = progress.answers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...progress.answers];

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, value };
    } else {
      newAnswers.push({ questionId, value });
    }

    const newProgress: AssessmentProgress = {
      ...progress,
      answers: newAnswers,
    };

    setProgress(newProgress);
    const key = getUserProgressKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(newProgress));
    }
  }, [progress, user, getUserProgressKey]);

  const goToQuestion = useCallback((index: number) => {
    if (!progress || !user) return;

    const newProgress: AssessmentProgress = {
      ...progress,
      currentQuestionIndex: Math.max(0, Math.min(index, QUESTIONS.length - 1)),
    };

    setProgress(newProgress);
    const key = getUserProgressKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(newProgress));
    }
  }, [progress, user, getUserProgressKey]);

  const calculateResults = useCallback((): AssessmentResult | null => {
    if (!progress || !user || progress.answers.length < QUESTIONS.length) return null;

    // Calculate scores per strength
    const strengthScores: Record<string, number> = {};
    
    STRENGTHS.forEach(s => {
      strengthScores[s.id] = 0;
    });

    progress.answers.forEach(answer => {
      const question = QUESTIONS.find(q => q.id === answer.questionId);
      if (question) {
        strengthScores[question.strengthId] += answer.value;
      }
    });

    // Create scored and ranked list
    const scores: StrengthScore[] = Object.entries(strengthScores)
      .map(([strengthId, score]) => ({
        strengthId,
        strength: getStrengthById(strengthId)!,
        score,
        rank: 0,
      }))
      .sort((a, b) => b.score - a.score);

    // Assign ranks (handle ties)
    scores.forEach((score, index) => {
      score.rank = index + 1;
    });

    // Calculate domain scores
    const domainScores: Record<Domain, number> = {
      executing: 0,
      influencing: 0,
      relationship: 0,
      strategic: 0,
    };

    scores.forEach(s => {
      domainScores[s.strength.domain] += s.score;
    });

    const result: AssessmentResult = {
      id: crypto.randomUUID(),
      userId: user.id,
      scores,
      completedAt: new Date().toISOString(),
      domainScores,
    };

    return result;
  }, [progress, user]);

  const completeAssessment = useCallback(() => {
    const result = calculateResults();
    if (!result || !user) return null;

    setResults(result);
    
    const resultsKey = getUserResultsKey();
    if (resultsKey) {
      localStorage.setItem(resultsKey, JSON.stringify(result));
    }

    // Clear progress
    const progressKey = getUserProgressKey();
    if (progressKey) {
      localStorage.removeItem(progressKey);
    }
    setProgress(null);

    return result;
  }, [calculateResults, user, getUserProgressKey, getUserResultsKey]);

  const resetAssessment = useCallback(() => {
    if (!user) return;

    const progressKey = getUserProgressKey();
    const resultsKey = getUserResultsKey();

    if (progressKey) localStorage.removeItem(progressKey);
    if (resultsKey) localStorage.removeItem(resultsKey);

    setProgress(null);
    setResults(null);
  }, [user, getUserProgressKey, getUserResultsKey]);

  const currentQuestion = progress ? QUESTIONS[progress.currentQuestionIndex] : null;
  const currentAnswer = progress && currentQuestion
    ? progress.answers.find(a => a.questionId === currentQuestion.id)?.value
    : undefined;

  const isComplete = progress?.answers.length === QUESTIONS.length;
  const hasInProgress = progress !== null && !isComplete;
  const hasResults = results !== null;

  return {
    progress,
    results,
    isLoading,
    currentQuestion,
    currentAnswer,
    totalQuestions: QUESTIONS.length,
    isComplete,
    hasInProgress,
    hasResults,
    startAssessment,
    answerQuestion,
    goToQuestion,
    completeAssessment,
    resetAssessment,
  };
}
