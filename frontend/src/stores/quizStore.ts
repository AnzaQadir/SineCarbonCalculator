import { create } from 'zustand';
import { PersonalityResponse } from '@/types/personality';
import type { UserResponses } from '@/services/api';

interface QuizStore {
  quizResults: PersonalityResponse | null;
  setQuizResults: (results: PersonalityResponse | null) => void;
  clearQuizResults: () => void;
  quizAnswers: UserResponses | null;
  setQuizAnswers: (answers: UserResponses | null) => void;
  clearQuizAnswers: () => void;
  lastStep: number | null;
  setLastStep: (step: number) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  quizResults: null,
  setQuizResults: (results) => set({ quizResults: results }),
  clearQuizResults: () => set({ quizResults: null }),
  quizAnswers: null,
  setQuizAnswers: (answers) => set({ quizAnswers: answers }),
  clearQuizAnswers: () => set({ quizAnswers: null }),
  lastStep: null,
  setLastStep: (step) => set({ lastStep: step }),
})); 