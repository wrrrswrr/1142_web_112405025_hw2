"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "../store/store";
import { playCameraClick } from "./utils/audio";

const SHUTTER_TOP = 84;
const SHUTTER_LEFT = 30;
const SHUTTER_SIZE = 30;


export default function Home() {
  const router = useRouter();
  const resetStore = usePsyStore((state) => state.reset);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    resetStore();
  }, [resetStore]);

  const handleShutterClick = () => {
    if (isFlashing) return;

    playCameraClick();

    setIsFlashing(true);
    setIsPressing(true);

    setTimeout(() => {
      router.push("/question");
    }, 150);
  };

  return (
    <div className="relative w-full h-full select-none p-6">
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 opacity-100 pointer-events-none" />
      )}

      <div className="w-full h-full flex flex-col justify-between items-center py-8 px-2 z-10 relative">
        <div className="text-center space-y-4 pt-4">
          <h1 className="font-handwriting text-3xl font-semibold tracking-wide text-[#2B2927] font-sans antialiased">
            按下快門，沖洗你的潛意識
          </h1>
          <p className="text-xs text-neutral-400 tracking-wider">
            —— 照相式心靈投影測驗 ——
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full grow py-4">

          <div className="w-64 h-64 relative flex items-center justify-center bg-transparent">

            <img
              src="/cam.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/cam.png";
              }}
              alt="手繪拍立得相機"
              className="w-full h-full object-contain pointer-events-none"
            />

            <button
              id="shutter-gate-button"
              onClick={handleShutterClick}
              style={{
                top: `${SHUTTER_TOP}px`,
                left: `${SHUTTER_LEFT}px`,
                width: `${SHUTTER_SIZE}px`,
                height: `${SHUTTER_SIZE}px`
              }}
              className={`absolute rounded-full bg-[#E54B35] border-2 border-[#1E1C1A] shadow-md hover:bg-[#F05E49] duration-150 transition-all active:scale-95 flex items-center justify-center group cursor-pointer ${isPressing ? "scale-90" : ""
                }`}
              title="按下紅色快門按鈕"
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#E54B35] opacity-25 animate-ping group-hover:hidden" />
            </button>
          </div>

          <p className="text-[#605E5A] text-xs font-light text-center max-w-[280px] leading-relaxed mt-4"><br />
            請點擊相機上的 <strong className="text-[#E54B35] font-semibold">「紅色快門按鈕」</strong> 拍照，開啟您的觀景窗之旅。
          </p>
        </div>

        <div className="w-full text-center pb-2">
          <span className="text-[9px] font-mono tracking-widest text-[#1E1C1A]/40 uppercase">
            Polaroid Camera Visual Probe
          </span>
        </div>
      </div>
    </div>
  );
}

