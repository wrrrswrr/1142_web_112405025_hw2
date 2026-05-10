import { create } from 'zustand';

const questionData = [
  {
    tittle: "就是題目1",
    options:[
      {
        text: "選項一",
        value: 1
      },
      {
        text: "選項二",
        value: 2
      },
      {
        text: "選項三",
        value: 3
      },
    ]
  },
  {
    tittle: "就是題目2",
    options:[
      {
        text: "選項一",
        value: 1
      },
      {
        text: "選項二",
        value: 2
      },
      {
        text: "選項三",
        value: 3
      },
    ]
  },
  {
    tittle: "就是題目3",
    options:[
      {
        text: "選項一",
        value: 1
      },
      {
        text: "選項二",
        value: 2
      },
      {
        text: "選項三",
        value: 3
      },
    ]
  },


]

// 建立 store hook
const usePsyStore = create((set) => ({
    // states and actions
  psyData:{
    score: 0,
    quizeData: questionData,
  },
  
  setScore: (score) => set((state) => ({psyData:{...state.psyData, score: score}}))


}))


export { usePsyStore }