"use client";

import { useState, useEffect } from "react";
 
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Printer,
  Check,
  X
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import {
  getCurrentWeekMealPlan,
  getShoppingLists,
  createShoppingList,
  generateShoppingListFromMealPlan,
  addShoppingListItem,
  toggleShoppingItem,
  deleteShoppingListItem,
} from "@/lib/meal-plan-api";
import type { ShoppingList, ShoppingListItem } from "@/lib/types";

export default function ShoppingListPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Other");

  useEffect(() => {
    loadShoppingList();
  }, []);

  async function loadShoppingList() {
    try {
      const user = await getUser();
      if (!user) {
        router.push("/login?redirect=/meal-plan/shopping-list");
        return;
      }

      setUserId(user.id);

      // Get current week's meal plan
      const mealPlan = await getCurrentWeekMealPlan(user.id);
      
      if (!mealPlan) {
        setLoading(false);
        return;
      }

      // Check if shopping list already exists for this meal plan
      const lists = await getShoppingLists(user.id);
      const existingList = lists.find(
        (list) => list.meal_plan_id === mealPlan.id
      );

      if (existingList) {
        setShoppingList(existingList);
      } else {
        // Auto-generate shopping list from meal plan
        const generatedList = await generateShoppingListFromMealPlan(
          mealPlan.id,
          user.id
        );
        if (generatedList) {
          setShoppingList(generatedList);
        }
      }
    } catch (error) {
      console.error("Error loading shopping list:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleItem(itemId: string) {
    if (!shoppingList) return;

    const item = shoppingList.items?.find((i) => i.id === itemId);
    if (!item) return;

    const success = await toggleShoppingItem(itemId, !item.is_checked);
    if (success) {
      setShoppingList({
        ...shoppingList,
        items: shoppingList.items?.map((i) =>
          i.id === itemId ? { ...i, is_checked: !i.is_checked } : i
        ),
      });
    }
  }

  async function handleDeleteItem(itemId: string) {
    if (!confirm("Διαγραφή αυτού του προϊόντος;")) return;

    const success = await deleteShoppingListItem(itemId);
    if (success && shoppingList) {
      setShoppingList({
        ...shoppingList,
        items: shoppingList.items?.filter((item) => item.id !== itemId),
      });
    }
  }

  async function handleAddCustomItem() {
    if (!shoppingList || !newItemName.trim()) return;

    const newItem = await addShoppingListItem({
      shopping_list_id: shoppingList.id,
      ingredient: newItemName.trim(),
      category: newItemCategory,
      is_checked: false,
    });

    if (newItem) {
      setShoppingList({
        ...shoppingList,
        items: [...(shoppingList.items || []), newItem],
      });
      setNewItemName("");
      setNewItemCategory("Other");
    }
  }

  function handlePrint() {
    window.print();
  }

  // Group items by category
  const groupedItems: { [key: string]: ShoppingListItem[] } = {};
  shoppingList?.items?.forEach((item) => {
    const category = item.category || "Other";
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });

  const categories = Object.keys(groupedItems).sort();

  // Category icons
  const categoryIcons: { [key: string]: string } = {
    Produce: "🥬",
    Meat: "🥩",
    Dairy: "🧀",
    Bakery: "🍞",
    Pantry: "🏺",
    Spices: "🧂",
    Other: "📦",
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">Φόρτωση...</div>
        </div>
      </div>
    );
  }

  if (!shoppingList) {
    return (
      <div className="min-h-screen pt-16">
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-600/20" />
          
          <div className="container mx-auto text-center relative z-10">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Δεν υπάρχει λίστα αγορών</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Δημιουργήστε ένα meal plan για αυτή την εβδομάδα για να δημιουργήσετε αυτόματα τη λίστα αγορών σας
            </p>
            <Link href="/meal-plan">
              <Button size="lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Πίσω στο Meal Plan
              </Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const checkedCount = shoppingList.items?.filter((item) => item.is_checked).length || 0;
  const totalCount = shoppingList.items?.length || 0;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen pt-16 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        
        <div className="container mx-auto relative z-10">
          <Link href="/meal-plan">
            <Button variant="outline" className="mb-6 bg-white/10 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Πίσω στο Meal Plan
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">
                Shopping List
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80">
                {shoppingList.name}
              </p>
            </div>
            <Button onClick={handlePrint} size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm">
              <Printer className="w-5 h-5 mr-2" />
              Εκτύπωση
            </Button>
          </div>

          {/* Progress Bar */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Πρόοδος αγορών</span>
              <span className="text-sm text-muted-foreground">
                {checkedCount} / {totalCount} προϊόντα
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Print Title (hidden on screen) */}
      <div className="hidden print:block container mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold mb-2">{shoppingList.name}</h1>
        <p className="text-lg text-gray-600">
          {new Date().toLocaleDateString("el-GR")}
        </p>
      </div>

      {/* Shopping List Content */}
      <div className="container mx-auto px-4">
        {/* Add Custom Item */}
        <GlassPanel className="p-6 mb-8 print:hidden">
          <h3 className="text-lg font-bold mb-4">Προσθήκη custom προϊόντος</h3>
          <div className="flex gap-3">
            <Input
              placeholder="Όνομα προϊόντος..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomItem()}
              className="flex-1"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-input bg-background"
            >
              <option value="Produce">Λαχανικά/Φρούτα</option>
              <option value="Meat">Κρέας</option>
              <option value="Dairy">Γαλακτοκομικά</option>
              <option value="Bakery">Αρτοποιείο</option>
              <option value="Pantry">Ντουλάπι</option>
              <option value="Spices">Μπαχαρικά</option>
              <option value="Other">Άλλο</option>
            </select>
            <Button onClick={handleAddCustomItem} disabled={!newItemName.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Προσθήκη
            </Button>
          </div>
        </GlassPanel>

        {/* Grouped Items by Category */}
        <div className="space-y-6">
          {categories.map((category) => (
            <GlassPanel key={category} className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">{categoryIcons[category] || "📦"}</span>
                {category === "Produce" && "Λαχανικά & Φρούτα"}
                {category === "Meat" && "Κρέας & Ψάρι"}
                {category === "Dairy" && "Γαλακτοκομικά"}
                {category === "Bakery" && "Αρτοποιείο"}
                {category === "Pantry" && "Ντουλάπι"}
                {category === "Spices" && "Μπαχαρικά"}
                {category === "Other" && "Άλλα"}
                <span className="text-sm text-muted-foreground ml-2">
                  ({groupedItems[category].length})
                </span>
              </h2>

              <div className="space-y-2">
                {groupedItems[category]
                  .sort((a, b) => {
                    // Checked items go to bottom
                    if (a.is_checked !== b.is_checked) {
                      return a.is_checked ? 1 : -1;
                    }
                    return a.ingredient.localeCompare(b.ingredient);
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        item.is_checked
                          ? "bg-white/5 opacity-60"
                          : "bg-white/10 hover:bg-white/20"
                      } print:border print:border-gray-300 print:bg-white`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all print:hidden ${
                          item.is_checked
                            ? "bg-green-500 border-green-500"
                            : "border-white/50 hover:border-white"
                        }`}
                      >
                        {item.is_checked && <Check className="w-4 h-4 text-white" />}
                      </button>

                      {/* Print checkbox */}
                      <div className="hidden print:block w-4 h-4 border-2 border-gray-400 rounded" />

                      {/* Item Name */}
                      <div className="flex-1">
                        <p
                          className={`text-lg ${
                            item.is_checked ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {item.ingredient}
                        </p>
                        {item.quantity && (
                          <p className="text-sm text-muted-foreground">
                            {item.quantity}
                          </p>
                        )}
                        {item.recipe_id && item.recipe && (
                          <p className="text-xs text-muted-foreground mt-1">
                            από: {item.recipe.title}
                          </p>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors print:hidden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </GlassPanel>
          ))}
        </div>

        {totalCount === 0 && (
          <GlassPanel className="p-16 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Η λίστα είναι άδεια</h3>
            <p className="text-muted-foreground">
              Προσθέστε συνταγές στο meal plan σας για να δημιουργηθεί η λίστα αγορών
            </p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
