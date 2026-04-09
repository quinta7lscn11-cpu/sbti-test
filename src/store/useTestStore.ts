import { create } from 'zustand';
import { questions, specialQuestions } from '../data/sbti';

export type ScreenType = 'intro' | 'test' | 'result';

interface TestState {
  currentScreen: ScreenType;
  answers: Record<string, number>;
  shuffledQuestions: any[];
  previewMode: boolean;
  currentQuestionIndex: number;
  setScreen: (screen: ScreenType) => void;
  setAnswer: (questionId: string, value: number) => void;
  startTest: (preview?: boolean) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  reset: () => void;
}

function shuffleArray(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const useTestStore = create<TestState>((set, get) => ({
  currentScreen: 'intro',
  answers: {},
  shuffledQuestions: [],
  previewMode: false,
  currentQuestionIndex: 0,
  
  setScreen: (screen) => {
    set({ currentScreen: screen });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setAnswer: (questionId, value) => set((state) => {
    const newAnswers = { ...state.answers, [questionId]: value };
    // Handle drink gate logic
    if (questionId === 'drink_gate_q1' && value !== 3) {
      delete newAnswers['drink_gate_q2'];
    }
    
    // Check if the drink gate question changes the total number of questions.
    // If it decreases the total questions and we are on the new "last" question or beyond,
    // we need to adjust the currentQuestionIndex to avoid pointing to an undefined question.
    let newIndex = state.currentQuestionIndex;
    const visible = [...state.shuffledQuestions];
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
    if (gateIndex !== -1 && newAnswers['drink_gate_q1'] === 3) {
      visible.splice(gateIndex + 1, 0, specialQuestions[1]);
    }
    if (newIndex >= visible.length) {
      newIndex = visible.length - 1;
    }

    return { answers: newAnswers, currentQuestionIndex: newIndex };
  }),

  nextQuestion: () => set((state) => {
    // 重新计算可见题目，因为可能触发了隐藏题目
    const visible = [...state.shuffledQuestions];
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
    if (gateIndex !== -1 && state.answers['drink_gate_q1'] === 3) {
      visible.splice(gateIndex + 1, 0, specialQuestions[1]);
    }
    
    if (state.currentQuestionIndex < visible.length - 1) {
      return { currentQuestionIndex: state.currentQuestionIndex + 1 };
    }
    return state;
  }),

  prevQuestion: () => set((state) => {
    if (state.currentQuestionIndex > 0) {
      return { currentQuestionIndex: state.currentQuestionIndex - 1 };
    }
    return state;
  }),

  startTest: (preview = false) => set(() => {
    const shuffledRegular = shuffleArray(questions);
    const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
    const newShuffledQuestions = [
      ...shuffledRegular.slice(0, insertIndex),
      specialQuestions[0],
      ...shuffledRegular.slice(insertIndex)
    ];

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return {
      currentScreen: 'test',
      answers: {},
      shuffledQuestions: newShuffledQuestions,
      previewMode: preview,
      currentQuestionIndex: 0
    };
  }),

  reset: () => set({
    currentScreen: 'intro',
    answers: {},
    shuffledQuestions: [],
    previewMode: false,
    currentQuestionIndex: 0
  })
}));
