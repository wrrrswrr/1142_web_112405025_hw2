"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "../../store/store";
import { playFilmWinding } from ".././utils/audio";
import { ArrowLeft } from "lucide-react";

export default function Question() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isIntroFlashing, setIsIntroFlashing] = useState(true);

  const psyData = usePsyStore((state) => state.psyData);
  const setPsyScore = usePsyStore((state) => state.setScore);
  const setPsyAnswer = usePsyStore((state) => state.setAnswer);

  const totalQuestions = psyData?.quizData?.length || 5;
  const currentQuestion = psyData?.quizData?.[questionIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroFlashing(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    playFilmWinding();
  }, [questionIndex]);

  if (!currentQuestion) {
    return (
      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-neutral-400">
        [ 正在對焦觀景窗... ]
      </div>
    );
  }

  const handleOptionClick = (optionIndex: number) => {
    const selectedOption = currentQuestion.options[optionIndex];

    playFilmWinding();

    setPsyScore(psyData.score + selectedOption.value);

    setPsyAnswer(questionIndex, selectedOption.letter);

    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      router.push("/prepare");
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
    } else {
      router.push("/");
    }
  };

  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="relative w-full h-full select-none p-6">

      <div
        className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300 ease-in-out ${isIntroFlashing ? "opacity-100" : "opacity-0"
          }`}
      />

      <div className="w-full h-full flex flex-col justify-between px-6 py-4 sm:px-8 z-10 relative">
        <div className="absolute -top-4 -left-4 w-6 h-6 border-t-2 border-l-2 border-[#1E1C1A] pointer-events-none" />
        <div className="absolute -top-4 -right-4 w-6 h-6 border-t-2 border-r-2 border-[#1E1C1A] pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b-2 border-l-2 border-[#1E1C1A] pointer-events-none" />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b-2 border-r-2 border-[#1E1C1A] pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <div className="w-16 h-16 border-2 border-dashed border-[#1E1C1A] rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#1E1C1A] rounded-full" />
          </div>
        </div>

        <div className="z-10 flex items-center justify-between font-mono text-[10px] text-[#1E1C1A] border-b border-[#1E1C1A]/10 pb-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 font-medium hover:opacity-75 transition-opacity cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#1E1C1A] group-hover:-translate-x-0.5 transition-transform" />
            <span>BACK</span>
          </button>
          <span className="text-[#1E1C1A]/65 tracking-wider hidden sm:inline">1/125s · f/2.8 · ISO 400</span>
          <div className="font-semibold tracking-widest text-[#1E1C1A]">
            VIEWFINDER {questionIndex + 1} / {totalQuestions}
          </div>
        </div>

        <div className="grow flex flex-col justify-center py-4 z-10">

          <div className="w-full h-3 border-2 border-[#1E1C1A] bg-white rounded-full p-0.5 mb-6 overflow-hidden">
            <div
              className="h-full bg-[#E54B35] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-5">

            <div className="bg-white border-2 border-[#1E1C1A] p-5 rounded-xl shadow-[4px_4px_0px_0px_#1E1C1A]">
              <h2 className="text-[14px] font-medium leading-relaxed text-[#1E1C1A]">
                {currentQuestion.title}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className="w-full text-left p-4 bg-white border-2 border-[#1E1C1A] rounded-xl hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_#1E1C1A] transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className="text-[13px] text-[#2B2927] leading-relaxed font-sans">
                    {option.text}
                  </span>

                  <span className="w-6 h-6 shrink-0 flex items-center justify-center border-2 border-[#1E1C1A] rounded-full bg-[#FCFAEE] text-[10px] font-bold font-mono group-hover:bg-[#E54B35] group-hover:text-white transition-colors duration-150">
                    {option.letter}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="z-10 flex items-center justify-between font-mono text-[9px] tracking-widest text-[#1E1C1A]/50 border-t border-[#1E1C1A]/10 pt-3">
          <span>● REC 0{questionIndex + 1}</span>
          <span>FOCUSING SUBCONSCIOUS CAMERA PERSPECTIVE</span>
        </div>
      </div>
    </div>
  );
}
