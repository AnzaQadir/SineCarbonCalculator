import { create } from 'zustand';
import { PersonalityResponse } from '@/types/personality';

interface QuizStore {
  quizResults: PersonalityResponse | null;
  setQuizResults: (results: PersonalityResponse | null) => void;
  clearQuizResults: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  quizResults: null,
  setQuizResults: (results) => set({ quizResults: results }),
  clearQuizResults: () => set({ quizResults: null }),
})); 