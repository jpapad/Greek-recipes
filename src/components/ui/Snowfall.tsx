"use client";

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Create 50 snowflakes with random properties
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2, // 2-5 seconds
      opacity: Math.random() * 0.6 + 0.4, // 0.4-1
      size: Math.random() * 10 + 5, // 5-15px
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden print:hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: flake.opacity,
          }}
        >
          <div
            className="text-white"
            style={{
              fontSize: `${flake.size}px`,
            }}
          >
            ❄
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(100vh) translateX(100px);
          }
        }
        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </div>
  );
}
