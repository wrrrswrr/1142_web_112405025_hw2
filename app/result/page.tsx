"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "../../store/store";
import { playCameraClick } from ".././utils/audio";
import { Check, Share2, RotateCcw } from "lucide-react";

interface ArchetypeResult {
  letter: "A" | "B" | "C" | "D";
  title: string;
  theme: string;
  desc: string;
  partner: string;
  advice: string;
  imageUrl: string;
}

const archetypeData: Record<"A" | "B" | "C" | "D", ArchetypeResult> = {
  A: {
    letter: "A",
    title: "【星雲與眼】",
    theme: "追逐未見之物",
    desc: "你擁有超凡的想像力與敏銳直覺。你不甘於平庸，目光總是看向遙遠天際。這張底片定格出了你內心靈魂的廣闊，提醒你即使生活偶爾沉悶，也不要失去眼裡的星河。",
    partner: "結果 D：【深扎的根】",
    advice: "在追逐星空的同時，去撫摸具體的貓、品嚐真實的咖啡，讓自己溫和地降落在大地上。",
    imageUrl: "/A.png",
  },
  B: {
    letter: "B",
    title: "【半掩的窗】",
    theme: "寧靜中的美好",
    desc: "你是一個細膩真誠的觀察者。懂得在平淡的日常縫隙中找到平靜，無需用喧鬧來證明自己。這張底片映照出你內心深處的安穩，以及你最珍視的溫柔獨處時光。",
    partner: "結果 C：【捧著的火光】",
    advice: "當你安享半掩窗櫺的恬靜時，試著偶爾跨出大門一步，將你美麗的洞察分享給世界。",
    imageUrl: "/B.png",
  },
  C: {
    letter: "C",
    title: "【捧著的火光】",
    theme: "感受一切生命",
    desc: "你充滿溫度與無私的共情力。極度重視人與人之間的真摯連結，願意為在乎的事物燃燒滿膛熱情。這張底片定格了你內心的火種，無論世界多冷，你都擁有溫暖他人的力量。",
    partner: "結果 B：【半掩的窗】",
    advice: "在源源不絕溫暖別人之餘，別忘了也給自己蓋上一張厚毯，好生保養與擁抱你自己的火種。",
    imageUrl: "/C.png",
  },
  D: {
    letter: "D",
    title: "【深扎的根】",
    theme: "穩固扎根與堅實",
    desc: "你務實、可靠且堅韌不拔。不盲目追求轉瞬即逝的絢爛火花，而看重長遠的累積與沉澱。這張底片顯影了你的平穩，你是身處風浪中身邊人最依賴的定海神針。",
    partner: "結果 A：【星雲與眼】",
    advice: "土壤上也偶有彩虹。學會卸下多餘的責任與防備，讓心靈像落葉一樣，輕盈隨性地飛舞一次。",
    imageUrl: "/D.png",
  }
};

export default function Result() {
  const router = useRouter();
  const psyData = usePsyStore((state) => state.psyData);
  const resetStore = usePsyStore((state) => state.reset);

  const [copied, setCopied] = useState(false);
  const [winner, setWinner] = useState<"A" | "B" | "C" | "D">("A");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const answersList = psyData.answers || [null, null, null, null, null];
    const counts: Record<"A" | "B" | "C" | "D", number> = { A: 0, B: 0, C: 0, D: 0 };

    answersList.forEach((letter) => {
      if (letter) counts[letter]++;
    });

    const maxVal = Math.max(counts.A, counts.B, counts.C, counts.D);
    const candidates = (["A", "B", "C", "D"] as const).filter(
      (letter) => counts[letter] === maxVal
    );

    let chosenResult: "A" | "B" | "C" | "D" = "A";

    if (candidates.length === 1) {
      chosenResult = candidates[0];
    } else {
      const q4Choice = answersList[3];
      if (q4Choice && candidates.includes(q4Choice)) {
        chosenResult = q4Choice;
      } else {
        chosenResult = candidates[0];
      }
    }

    setWinner(chosenResult);

    playCameraClick();

    const timeout = setTimeout(() => {
      setRevealed(true);
    }, 150);

    return () => clearTimeout(timeout);
  }, [psyData.answers]);

  const winnerResult = archetypeData[winner];

  const handleShareClick = () => {
    const shareText = `【沖洗你的潛意識・心靈拍立得報告】
我的顯影結果是：${winnerResult.title} — ${winnerResult.theme}
${winnerResult.desc}
快點擊連結洗出你專屬的底片吧！
${window.location.origin}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePlayAgain = () => {
    resetStore();
    router.push("/");
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center pl-10 pr-10 pt-12 pb-12 select-none overflow-y-auto scrollbar-thin text-[#1E1C1A]">
      
      <div className="w-full text-center space-y-2 pt-2 flex-none h-16">
        <h1 className="font-handwriting text-3xl font-semibold tracking-wide text-[#2B2927]">
          潛意識顯影底片
        </h1>
        <p className="text-xs text-neutral-400 tracking-wider">
          {revealed 
            ? `—— TYPE ${winnerResult.letter} : ${winnerResult.theme} ——`
            : "—— 潛意識終極顯影結晶 ——"
          }
        </p>
      </div>

      <div className="w-full h-[280px] flex items-center justify-center relative overflow-visible flex-none mt-4">
        
        <div className="w-64 h-[280px] relative flex items-center justify-center overflow-visible bg-transparent font-sans">
          
          <div 
            style={{
              transform: "translateY(-10px) scale(1.15) rotate(0deg)"
            }}
            className="absolute z-20 w-56 h-56 bg-transparent overflow-hidden flex items-center justify-center pointer-events-auto transition-transform"
          >
            <img
              src="/0.png"
              alt="底片載體"
              className="w-full h-full object-contain pointer-events-none"
            />

            <img
              src={winnerResult.imageUrl}
              alt={winnerResult.title}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1200 ease-in-out z-30 pointer-events-none ${
                revealed ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

        </div>

      </div>

      <div 
        className={`w-full max-w-[310px] space-y-4 pt-4 transition-all duration-1000 ease-out font-sans grow ${
          revealed 
            ? "opacity-100 transform translate-y-0 scale-100 pointer-events-auto" 
            : "opacity-0 transform translate-y-12 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white border-2 border-[#1E1C1A] rounded-xl p-4 shadow-[5px_5px_0px_0px_#1E1C1A] text-left space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E1C1A]">
              {winnerResult.title}
            </h2>
            <span className="text-[10px] font-mono tracking-widest bg-[#E54B35] text-white px-2 py-0.5 rounded-full border border-[#1E1C1A]">
              TYPE: {winnerResult.letter}
            </span>
          </div>

          <p className="text-xs text-[#52504C] leading-relaxed">
            {winnerResult.desc}
          </p>

          <div className="pt-2 border-t border-[#1E1C1A]/10 space-y-1.5 text-[11px]">
            <div className="text-[#605E5A]">
              <strong className="text-[#1E1C1A]">修行心法：</strong>{winnerResult.advice}
            </div>
            <div className="text-[#605E5A]">
              <strong className="text-[#1E1C1A]">心靈共鳴伴侶：</strong>{winnerResult.partner}
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full pb-6">
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-2 px-3 border-2 border-[#1E1C1A] bg-white hover:bg-[#FCFAEE] rounded-lg text-xs font-semibold text-[#1E1C1A] transition-colors cursor-pointer flex items-center justify-center gap-1.5 duration-100 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新檢測</span>
          </button>

          <button
            onClick={handleShareClick}
            className="flex-1 py-2 px-3 bg-[#1E1C1A] text-white border-2 border-[#1E1C1A] hover:bg-neutral-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 duration-100 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-300" />
                <span>複製成功</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>分享報告</span>
              </>
            )}
          </button>
        </div>

      </div>

      <div className="w-full text-center pb-2 flex-none">
        <span className="text-[9px] font-mono tracking-widest text-[#1E1C1A]/40">
          PURE MOMENTS SOUL CHROMATOGRAPHY
        </span>
      </div>

    </div>
  );
}
