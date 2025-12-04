'use client';

import { useEffect, useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Plus, ShoppingCart } from 'lucide-react';
import { getCurrentWeekMealPlan, getMealPlans, createMealPlan } from '@/lib/meal-plan-api';
import { getUser } from '@/lib/auth';
import type { MealPlan } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { MealPlanCalendar } from '@/components/meal-plan/MealPlanCalendar';
import Link from 'next/link';

export default function MealPlanPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(getStartOfWeek(new Date()));

  useEffect(() => {
    loadCurrentWeekPlan();
  }, [weekStart]);

  function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  function getEndOfWeek(start: Date): Date {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  }

  async function loadCurrentWeekPlan() {
    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        router.push('/login?redirect=/meal-plan');
        return;
      }

      setUserId(user.id);
      const plan = await getCurrentWeekMealPlan(user.id);
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error loading meal plan:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createWeekPlan() {
    if (!userId) return;

    const weekEnd = getEndOfWeek(weekStart);
    const plan = await createMealPlan({
      user_id: userId,
      name: `Week of ${weekStart.toLocaleDateString('el-GR')}`,
      week_start_date: weekStart.toISOString().split('T')[0],
      week_end_date: weekEnd.toISOString().split('T')[0],
    });

    if (plan) {
      setCurrentPlan(plan);
    }
  }

  function previousWeek() {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() - 7);
    setWeekStart(newStart);
  }

  function nextWeek() {
    const newStart = new Date(weekStart);
    newStart.setDate(weekStart.getDate() + 7);
    setWeekStart(newStart);
  }

  function thisWeek() {
    setWeekStart(getStartOfWeek(new Date()));
  }

  const weekEnd = getEndOfWeek(weekStart);
  const isCurrentWeek = weekStart.toDateString() === getStartOfWeek(new Date()).toDateString();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">Φόρτωση...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-purple-500/20" />
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold text-green-600 dark:text-green-400 border border-green-500/30 shadow-lg">
              🗓️ Εβδομαδιαίος Προγραμματισμός
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Meal Planner
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Οργανώστε τα γεύματά σας για ολόκληρη την εβδομάδα
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 relative z-10">
        {/* Week Navigation */}
        <GlassPanel className="p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={previousWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {weekStart.toLocaleDateString('el-GR', { month: 'long', day: 'numeric' })} - {weekEnd.toLocaleDateString('el-GR', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                {isCurrentWeek && (
                  <span className="text-sm text-primary">Τρέχουσα Εβδομάδα</span>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={nextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {!isCurrentWeek && (
                <Button variant="outline" onClick={thisWeek}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Τρέχουσα Εβδομάδα
                </Button>
              )}
              
              {currentPlan && (
                <Link href={`/meal-plan/shopping-list?planId=${currentPlan.id}`}>
                  <Button className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Λίστα Αγορών
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </GlassPanel>

        {/* Meal Plan Calendar */}
        {currentPlan ? (
          <MealPlanCalendar 
            mealPlan={currentPlan} 
            weekStart={weekStart}
            onUpdate={loadCurrentWeekPlan}
          />
        ) : (
          <GlassPanel className="p-16 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Δεν υπάρχει πλάνο για αυτή την εβδομάδα</h3>
            <p className="text-muted-foreground mb-6">
              Δημιουργήστε ένα εβδομαδιαίο πλάνο γευμάτων για να ξεκινήσετε
            </p>
            <Button onClick={createWeekPlan}>
              <Plus className="w-4 h-4 mr-2" />
              Δημιουργία Πλάνου
            </Button>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
