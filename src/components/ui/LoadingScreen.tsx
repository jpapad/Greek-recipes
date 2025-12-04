"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative text-center space-y-8">
        {/* Logo with Animation */}
        <div className="relative mx-auto w-48 h-48 animate-in zoom-in duration-700">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative w-full h-full animate-float">
            <Image
              src="/logo.svg"
              alt="ΕΛΛΑΔΑ ΣΤΟ ΠΙΑΤΟ"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            ΕΛΛΑΔΑ ΣΤΟ ΠΙΑΤΟ
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Ας γευτούμε την παράδοση
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center animate-in fade-in duration-700 delay-500">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-white/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-white/70 animate-in fade-in duration-700 delay-700">
          Φορτώνουμε τις καλύτερες συνταγές...
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}
