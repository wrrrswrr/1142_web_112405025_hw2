"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { playFilmWinding, playCameraClick } from ".././utils/audio";

export default function Prepare() {
  const router = useRouter();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    playFilmWinding();

    const totalDuration = 3000; 
    const intervalMs = 30; 
    const step = 100 / (totalDuration / intervalMs);

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(100, prev + step);
      });
    }, intervalMs);

    const audioTimeout = setTimeout(() => {
      playFilmWinding();
    }, 1500);

    const navTimeout = setTimeout(() => {
      router.push("/result");
    }, totalDuration + 400);

    return () => {
      clearInterval(timer);
      clearTimeout(audioTimeout);
      clearTimeout(navTimeout);
    };
  }, [router]);

  useEffect(() => {
    if (percent >= 100) {
      playCameraClick();
    }
  }, [percent]);

  return (
    <div className="relative w-full h-full flex flex-col items-center pl-10 pr-10 pt-12 pb-12 select-none overflow-y-auto scrollbar-thin text-[#1E1C1A]">
      
      <div className="w-full text-center space-y-2 pt-2 flex-none h-16">
        <h1 className="font-handwriting text-3xl font-semibold tracking-wide text-[#2B2927]">
          正在物理顯影中...
        </h1>
        <p className="text-xs text-neutral-400 tracking-wider">
          —— 潛意識正緩慢重組 ——
        </p>
      </div>

      <div className="w-full h-[280px] flex items-center justify-center relative overflow-visible flex-none mt-4">
        
        <div className="w-64 h-[280px] relative flex items-center justify-center overflow-visible bg-transparent font-sans">
          
          <div 
            style={{
              transform: percent < 15 
                ? "translateY(50px) scale(0.85) rotate(-4deg)" 
                : percent < 70 
                  ? "translateY(-85px) scale(0.95) rotate(2deg)" 
                  : "translateY(-10px) scale(1.15) rotate(0deg)"
            }}
            className={`absolute z-20 w-56 h-56 bg-transparent overflow-hidden flex items-center justify-center transition-all duration-1000 ease-in-out ${
              percent < 15 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <img
              src="/0.png"
              alt="正在物理顯影的底片 (0)"
              style={{
                opacity: Math.min(1, Math.max(0, (percent - 15) / 20))
              }}
              className="w-full h-full object-contain transition-all duration-300 pointer-events-none"
            />
          </div>

          <div 
            style={{
              transform: percent < 15 
                ? "translateY(80px) scale(1.4)" 
                : percent < 70 
                  ? "translateY(65px) scale(1.35)" 
                  : "translateY(110px) scale(1.15)"
            }}
            className={`absolute z-10 w-44 h-44 transition-all duration-700 ease-in-out transform ${
              percent >= 70 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <img
              src="/cam.png"
              alt="手繪拍立得相機"
              className="w-full h-full object-contain pointer-events-none filter drop-shadow-md"
            />
            {percent >= 15 && percent < 70 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-white/40 blur-sm rounded-full animate-pulse pointer-events-none" />
            )}
          </div>

        </div>

      </div>
      
    </div>
  );
}