"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "../../store/store"

export default function Question() {

  const psyData = usePsyStore((state) => state.psyData)
  const setPsyScore = usePsyStore((state) => state.setScore)

  console.log(psyData)
  console.log(psyData.quizeData)

  const router = useRouter();

  const [questionIndex, setQuestionIndex] = useState(0);


  useEffect(() => {
    console.log("目前分數"+psyData.score);
  }, [psyData.score]);
  

  function nextQuestion(optionIndex: any){
    console.log("使用者選擇:"+ optionIndex);

    setPsyScore( psyData.score + psyData.quizeData[questionIndex].options[optionIndex].value );
    console.log( psyData.score );

    if(questionIndex != psyData.quizeData.length-1){
      console.log("下一題");
      setQuestionIndex (questionIndex + 1)
    }
    else{
      console.log("準備看結果頁面");
      router.push("/prepare")
    }
  }

  return (
    <>
 
      <div className="text-black flex flex-col justify-center items-center gap-4">
        答題        
        
        <div>
          <div>{ ("Q"+(questionIndex+1))+"."+ psyData.quizeData[questionIndex].tittle }</div>
          <div onClick={ ()=>nextQuestion(0)}>{ psyData.quizeData[questionIndex].options[0].text }</div>
          <div onClick={ ()=>nextQuestion(1)}>{ psyData.quizeData[questionIndex].options[1].text }</div>
          <div onClick={ ()=>nextQuestion(2)}>{ psyData.quizeData[questionIndex].options[2].text }</div>
        </div>

        <div>下一題</div>
        <Link className="text-white bg-black px-3 py-2" href="/prepare">準備看結果</Link>
      </div>
    </>
  );
}
