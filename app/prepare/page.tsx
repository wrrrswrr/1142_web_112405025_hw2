"use client"

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Prepare() {

  return (
    <>

      <div className="text-black flex flex-col justify-center items-center gap-4">
        準備
        <Link className="text-white bg-black px-3 py-2" href="/result">看結果</Link>
        
      </div>
    </>
  );
}
