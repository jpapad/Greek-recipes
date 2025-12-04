"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, Clock, ChefHat, MapPin } from "lucide-react";
import type { Recipe, Region } from "@/lib/types";

interface HeroSliderProps {
  recipes: Recipe[];
  regions: Region[];
  totalRecipes: number;
}

export function HeroSlider({ recipes, regions, totalRecipes }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % regions.length);
  }, [regions.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + regions.length) % regions.length);
  }, [regions.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  if (regions.length === 0) return null;

  return (
    <section className="relative h-screen w-screen overflow-hidden -mx-[50vw] left-[50%] right-[50%] -mt-20 pt-0">
      {/* Slides Container */}
      <div className="relative h-full w-full">
        {regions.map((region, index) => {
          const regionRecipes = recipes.filter(r => r.id === region.id).slice(0, 3);
          const isActive = index === currentSlide;
          const isPrev = index === (currentSlide - 1 + regions.length) % regions.length;
          const isNext = index === (currentSlide + 1) % regions.length;

          return (
            <div
              key={region.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive 
                  ? 'opacity-100 scale-100 z-10' 
                  : isPrev || isNext
                  ? 'opacity-0 scale-105 z-0'
                  : 'opacity-0 scale-95 z-0'
              }`}
            >
              {/* Background Image with Parallax Effect */}
              <div className="absolute inset-0">
                <Image
                  src={region.image_url || 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=1200&h=800&fit=crop'}
                  alt={region.name}
                  fill
                  priority={index === 0}
                  className={`object-cover transition-transform duration-[8000ms] ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="w-full px-8 md:px-16 lg:px-24 2xl:px-32">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Region Info */}
                    <div className="space-y-6 text-white">
                      {/* Region Badge */}
                      <div 
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full transition-all duration-700 delay-300 ${
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-semibold">Region of Greece</span>
                      </div>

                      {/* Title */}
                      <h1 
                        className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight transition-all duration-700 delay-500 ${
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                      >
                        <span className="bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                          {region.name}
                        </span>
                      </h1>

                      {/* Description */}
                      <p 
                        className={`text-xl md:text-2xl text-gray-100 leading-relaxed line-clamp-3 transition-all duration-700 delay-700 ${
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                      >
                        {region.description}
                      </p>

                      {/* Recipe Count */}
                      <div 
                        className={`flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit transition-all duration-700 delay-900 ${
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                      >
                        <ChefHat className="w-5 h-5" />
                        <span className="font-medium">{regionRecipes.length}+ recipes from this region</span>
                      </div>

                      {/* CTA Button */}
                      <div 
                        className={`pt-4 transition-all duration-700 delay-1000 ${
                          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                      >
                        <Button 
                          size="lg" 
                          className="rounded-full text-lg px-10 py-6 shadow-2xl hover:shadow-orange-500/50 bg-gradient-to-r from-orange-500 to-pink-500 border-0 hover:from-orange-600 hover:to-pink-600 hover:scale-105 transition-all group"
                          asChild
                        >
                          <Link href={`/regions/${region.slug}`}>
                            Explore {region.name}
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Right Side - Recipe Previews */}
                    <div 
                      className={`hidden lg:grid grid-cols-1 gap-4 transition-all duration-700 delay-1200 ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                      }`}
                    >
                      {regionRecipes.map((recipe, recipeIndex) => (
                        <Link
                          key={recipe.id}
                          href={`/recipes/${recipe.slug}`}
                          className="group flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all hover:scale-105 shadow-lg hover:shadow-[0_12px_40px_0_rgba(16,45,99,0.4),0_8px_30px_0_rgba(16,45,99,0.3)]"
                          style={{ transitionDelay: `${recipeIndex * 100}ms` }}
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={recipe.image_url || '/placeholder-recipe.jpg'}
                              alt={recipe.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate group-hover:text-orange-300 transition-colors">
                              {recipe.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-white/70">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {recipe.time_minutes}m
                              </span>
                              <span>•</span>
                              <span className="capitalize">{recipe.difficulty}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {regions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentSlide
                ? 'w-12 h-2 bg-white rounded-full'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-8 md:bottom-12 right-4 md:right-8 z-20 hidden lg:flex items-center gap-6">
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{totalRecipes}+</div>
          <div className="text-sm text-white/80">Recipes</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{regions.length}</div>
          <div className="text-sm text-white/80">Regions</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-8 z-20 hidden md:block animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
