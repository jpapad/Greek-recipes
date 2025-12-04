"use client";

import Image from 'next/image';

export function ChristmasSleigh() {
  return (
    <div className="fixed top-32 left-0 w-full pointer-events-none z-40 overflow-hidden">
      <div className="relative w-32 h-24 animate-sleigh-slide">
        <Image
          src="/sleigh.svg"
          alt="Christmas Sleigh"
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
      <style jsx>{`
        @keyframes sleigh-slide {
          0% {
            transform: translateX(-150px);
          }
          50% {
            transform: translateX(calc(100vw + 50px));
          }
          50.01% {
            transform: translateX(calc(100vw + 50px)) scaleX(-1);
          }
          100% {
            transform: translateX(-150px) scaleX(-1);
          }
        }
        .animate-sleigh-slide {
          animation: sleigh-slide 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
