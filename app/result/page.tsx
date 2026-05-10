"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePsyStore } from "@/store/store"

export default function Result() {

  const psyData = usePsyStore((state) => state.psyData);

  let result = null;
  if( psyData.score < 3 ){
    result = <div>結果A</div>
  }

  return (
    <>

      <div className="text-black flex flex-col justify-center items-center gap-4">
        結果,目前積分: {psyData.score}

        {
          psyData.score < 3 && <div>結果A</div>
        }

        {
          (psyData.score >= 3 && psyData.score < 7 ) && <div>結果B</div>
        }
        {
          psyData.score >= 7 && <div>結果C</div>
        }


        <div>結果A</div>
        <div>結果B</div>
        <div>結果C</div>

        <Link className="text-white bg-black px-3 py-2" href="/">再玩一次</Link>

      </div>
    </>
  );
}
