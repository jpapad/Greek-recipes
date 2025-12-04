'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Plus, Check, Trash2, Coffee, Sun, Moon, Cookie } from 'lucide-react';
import type { MealPlan, MealType, MealPlanItem } from '@/lib/types';
import { addMealPlanItem, deleteMealPlanItem, toggleMealCompleted } from '@/lib/meal-plan-api';
import { AddRecipeToMealModal } from './AddRecipeToMealModal';

interface MealPlanCalendarProps {
  mealPlan: MealPlan;
  weekStart: Date;
  onUpdate: () => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const GREEK_DAYS = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];

const MEAL_TYPES: { type: MealType; label: string; icon: any; color: string }[] = [
  { type: 'breakfast', label: 'Πρωινό', icon: Coffee, color: 'text-orange-500' },
  { type: 'lunch', label: 'Μεσημεριανό', icon: Sun, color: 'text-yellow-500' },
  { type: 'dinner', label: 'Βραδινό', icon: Moon, color: 'text-blue-500' },
  { type: 'snack', label: 'Σνακ', icon: Cookie, color: 'text-pink-500' },
];

export function MealPlanCalendar({ mealPlan, weekStart, onUpdate }: MealPlanCalendarProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; mealType: MealType } | null>(null);

  function getDateForDay(dayIndex: number): Date {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + dayIndex);
    return date;
  }

  function getMealForSlot(date: Date, mealType: MealType): MealPlanItem | undefined {
    const dateStr = date.toISOString().split('T')[0];
    return mealPlan.items?.find(
      item => item.date === dateStr && item.meal_type === mealType
    );
  }

  function openAddModal(date: Date, mealType: MealType) {
    setSelectedSlot({ date, mealType });
    setShowAddModal(true);
  }

  async function handleAddRecipe(recipeId: string) {
    if (!selectedSlot) return;

    const item = await addMealPlanItem({
      meal_plan_id: mealPlan.id,
      recipe_id: recipeId,
      date: selectedSlot.date.toISOString().split('T')[0],
      meal_type: selectedSlot.mealType,
      servings: 1,
      is_completed: false,
    });

    if (item) {
      setShowAddModal(false);
      setSelectedSlot(null);
      onUpdate();
    }
  }

  async function handleToggleCompleted(item: MealPlanItem) {
    const success = await toggleMealCompleted(item.id, !item.is_completed);
    if (success) {
      onUpdate();
    }
  }

  async function handleDelete(itemId: string) {
    if (!confirm('Διαγραφή αυτού του γεύματος;')) return;
    
    const success = await deleteMealPlanItem(itemId);
    if (success) {
      onUpdate();
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day, dayIndex) => {
          const date = getDateForDay(dayIndex);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={day}>
              {/* Day Header */}
              <GlassPanel className={`p-4 mb-4 text-center ${isToday ? 'bg-primary/10 border-primary/50' : ''}`}>
                <div className="font-bold text-lg">{GREEK_DAYS[dayIndex]}</div>
                <div className="text-sm text-muted-foreground">
                  {date.getDate()}/{date.getMonth() + 1}
                </div>
                {isToday && (
                  <div className="text-xs text-primary font-semibold mt-1">Σήμερα</div>
                )}
              </GlassPanel>

              {/* Meal Slots */}
              <div className="space-y-3">
                {MEAL_TYPES.map(({ type, label, icon: Icon, color }) => {
                  const meal = getMealForSlot(date, type);

                  return (
                    <GlassPanel
                      key={type}
                      className={`p-3 min-h-[120px] ${meal ? '' : 'border-dashed'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="text-xs font-semibold text-muted-foreground">
                            {label}
                          </span>
                        </div>
                        
                        {!meal && (
                          <button
                            onClick={() => openAddModal(date, type)}
                            className="hover:bg-white/20 rounded-full p-1 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {meal && meal.recipe ? (
                        <div className="space-y-2">
                          <div className={`text-sm font-semibold ${meal.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                            {meal.recipe.title}
                          </div>
                          
                          {meal.recipe.image_url && (
                            <img
                              src={meal.recipe.image_url}
                              alt={meal.recipe.title}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleCompleted(meal)}
                              className={`flex-1 text-xs px-2 py-1 rounded ${
                                meal.is_completed
                                  ? 'bg-green-500/20 text-green-600'
                                  : 'bg-white/20 hover:bg-white/30'
                              }`}
                            >
                              <Check className="w-3 h-3 inline mr-1" />
                              {meal.is_completed ? 'Ολοκληρώθηκε' : 'Μαρκάρισμα'}
                            </button>
                            
                            <button
                              onClick={() => handleDelete(meal.id)}
                              className="text-xs p-1 hover:bg-red-500/20 rounded text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : meal ? (
                        <div className="text-xs text-muted-foreground">
                          Συνταγή δεν βρέθηκε
                        </div>
                      ) : (
                        <div className="text-center text-xs text-muted-foreground py-4">
                          Κλικ + για προσθήκη
                        </div>
                      )}
                    </GlassPanel>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && selectedSlot && (
        <AddRecipeToMealModal
          date={selectedSlot.date}
          mealType={selectedSlot.mealType}
          onSelect={handleAddRecipe}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </>
  );
}
