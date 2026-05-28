import { useState, useEffect } from 'react';

export interface QuizOption {
  text: string;
  letter: 'A' | 'B' | 'C' | 'D';
  value: number; // Compatible with standard numerical additions
}

export interface QuizQuestion {
  id: number;
  title: string;
  options: QuizOption[];
}

export interface PsyData {
  score: number;
  quizData: QuizQuestion[];
  answers: ('A' | 'B' | 'C' | 'D' | null)[];
}

const initialQuizData: QuizQuestion[] = [
  {
    id: 1,
    title: "透過觀景窗，你第一眼想對焦的地方是哪裡？",
    options: [
      { text: "遙遠的遼闊天空或飛鳥", letter: 'A', value: 1 },
      { text: "牆角靜靜折射的光影", letter: 'B', value: 2 },
      { text: "眼前正在發生互動的人群", letter: 'C', value: 3 },
      { text: "腳下踩著的泥土或落葉", letter: 'D', value: 4 }
    ]
  },
  {
    id: 2,
    title: "畫面中有一個主要物件，你希望它是什麼狀態？",
    options: [
      { text: "正在移動中，帶點模糊的殘影", letter: 'A', value: 1 },
      { text: "靜止不動，有著清晰的輪廓與紋理", letter: 'B', value: 2 },
      { text: "散發著溫度，像是剛泡好的咖啡或火苗", letter: 'C', value: 3 },
      { text: "堅固且沉穩，像是一扇木門或老樹", letter: 'D', value: 4 }
    ]
  },
  {
    id: 3,
    title: "你準備按下快門，卻猶豫了三秒鐘，是因為：",
    options: [
      { text: "覺得下一個瞬間可能會更完美", letter: 'A', value: 1 },
      { text: "想再確認一下光線與構圖是否剛好", letter: 'B', value: 2 },
      { text: "怕相機的聲音驚擾了當下美好的氣氛", letter: 'C', value: 3 },
      { text: "思考這張底片用在這裡值不值得", letter: 'D', value: 4 }
    ]
  },
  {
    id: 4,
    title: "如果要在這張照片的空白邊框寫下一個詞，你會寫？",
    options: [
      { text: "未知 (Unknown)", letter: 'A', value: 1 },
      { text: "縫隙 (Gap)", letter: 'B', value: 2 },
      { text: "燃燒 (Burn)", letter: 'C', value: 3 },
      { text: "錨點 (Anchor)", letter: 'D', value: 4 }
    ]
  },
  {
    id: 5,
    title: "洗好的照片，你最後會怎麼處理它？",
    options: [
      { text: "貼在每天醒來就能看見的牆上", letter: 'A', value: 1 },
      { text: "夾在某本讀到一半的書頁裡當書籤", letter: 'B', value: 2 },
      { text: "送給剛才一起經歷這個畫面的人", letter: 'C', value: 3 },
      { text: "收進一個專門存放重要物品的鐵盒裡", letter: 'D', value: 4 }
    ]
  }
];

// In-memory state
let globalState: {
  psyData: PsyData;
} = {
  psyData: {
    score: 0,
    quizData: initialQuizData,
    answers: [null, null, null, null, null],
  }
};

const listeners = new Set<(state: typeof globalState) => void>();

export const store = {
  get: () => globalState,
  set: (updater: (state: typeof globalState) => void) => {
    updater(globalState);
    listeners.forEach((listener) => listener({ ...globalState }));
    // Safe serverless client persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('psy_test_store_backup_v2', JSON.stringify(globalState.psyData));
    }
  }
};

// Auto restore on layout bootstrap
if (typeof window !== 'undefined') {
  const backup = localStorage.getItem('psy_test_store_backup_v2');
  if (backup) {
    try {
      const parsed = JSON.parse(backup);
      if (parsed && typeof parsed.score === 'number' && Array.isArray(parsed.answers)) {
        globalState.psyData = {
          ...globalState.psyData,
          score: parsed.score,
          answers: parsed.answers
        };
      }
    } catch (e) {
      // Ignore parse issues
    }
  }
}

const stableOperations = {
  setScore: (score: number) => {
    store.set((state) => {
      state.psyData.score = score;
    });
  },
  setAnswer: (qIdx: number, letter: 'A' | 'B' | 'C' | 'D') => {
    store.set((state) => {
      state.psyData.answers[qIdx] = letter;
    });
  },
  reset: () => {
    store.set((state) => {
      state.psyData.score = 0;
      state.psyData.answers = [null, null, null, null, null];
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('psy_test_store_backup_v2');
    }
  }
};

// Custom hook matching Zustand shape
export function usePsyStore<T>(selector: (state: typeof globalState & typeof stableOperations) => T): T {
  const [currentState, setCurrentState] = useState(globalState);

  useEffect(() => {
    const listener = (nextState: typeof globalState) => {
      setCurrentState(nextState);
    };
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const storeOperations = {
    ...currentState,
    ...stableOperations
  };

  return selector(storeOperations);
}
