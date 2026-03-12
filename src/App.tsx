/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChefHat, Utensils, Clock, BrainCircuit, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateRecipe, Recipe } from './services/geminiService';

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [preferences, setPreferences] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipe(ingredients, preferences);
      setRecipe(result);
    } catch (err) {
      console.error(err);
      setError('Oops! Chef had a little kitchen accident. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecipe(null);
    setIngredients('');
    setPreferences('');
    setError(null);
  };

  const quickPrefs = ['Healthy', 'Quick', 'Vegetarian', 'Spicy'];

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a]/10 py-6 px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
              <ChefHat size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Smart Kitchen Chef</h1>
          </div>
          {recipe && (
            <button 
              onClick={reset}
              className="text-sm font-sans font-medium hover:underline flex items-center gap-2"
            >
              <RefreshCw size={14} /> Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!recipe ? (
            <motion.div
              key="input-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Welcome Section */}
              <section className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-light leading-tight">
                  What's in your <span className="italic">kitchen</span> today?
                </h2>
                <p className="text-[#5A5A40] text-lg max-w-xl mx-auto font-sans">
                  Tell me the ingredients you have, and I'll suggest a delicious recipe you can cook right now.
                </p>
              </section>

              {/* Input Form */}
              <form onSubmit={handleGenerate} className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-black/5 border border-[#1a1a1a]/5 space-y-8">
                <div className="space-y-4">
                  <label className="block text-sm font-sans font-semibold uppercase tracking-widest text-[#5A5A40]">
                    Your Ingredients
                  </label>
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. egg, bread, cheese, onion, tomato..."
                    className="w-full h-32 p-4 bg-[#f5f5f0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] resize-none text-lg font-sans placeholder:italic"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-sans font-semibold uppercase tracking-widest text-[#5A5A40]">
                    Any Preferences? (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickPrefs.map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setPreferences(prev => prev.includes(pref) ? prev.replace(pref, '').trim() : `${prev} ${pref}`.trim())}
                        className={`px-4 py-2 rounded-full border text-sm font-sans transition-all ${
                          preferences.includes(pref)
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                            : 'border-[#1a1a1a]/20 hover:border-[#5A5A40] text-[#1a1a1a]/60'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="e.g. low carb, vegan, under 15 mins..."
                    className="w-full p-4 bg-[#f5f5f0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !ingredients.trim()}
                  className="w-full py-5 bg-[#5A5A40] text-white rounded-full font-sans font-bold text-lg hover:bg-[#4a4a34] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-[#5A5A40]/20"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      Chef is thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Recipe
                    </>
                  )}
                </button>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 font-sans text-sm justify-center">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="recipe-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Recipe Card */}
              <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-black/5 border border-[#1a1a1a]/5">
                <div className="bg-[#5A5A40] p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-white/80 font-sans text-sm font-semibold uppercase tracking-widest">
                      <Utensils size={16} />
                      Your Custom Recipe
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      {recipe.dishName}
                    </h2>
                    <div className="flex flex-wrap gap-6 pt-4 font-sans">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-white/60" />
                        <span>{recipe.cookingTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BrainCircuit size={18} className="text-white/60" />
                        <span>{recipe.difficulty} Difficulty</span>
                      </div>
                    </div>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12">
                    <ChefHat size={200} />
                  </div>
                </div>

                <div className="p-8 md:p-12 grid md:grid-cols-3 gap-12">
                  {/* Sidebar: Ingredients */}
                  <div className="space-y-8">
                    <section className="space-y-4">
                      <h3 className="text-xl font-bold border-b border-[#1a1a1a]/10 pb-2">Ingredients</h3>
                      <ul className="space-y-3 font-sans">
                        {recipe.ingredientsUsed.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[#1a1a1a]/80">
                            <CheckCircle2 size={18} className="text-[#5A5A40] mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    {recipe.extraIngredients.length > 0 && (
                      <section className="space-y-4">
                        <h3 className="text-xl font-bold border-b border-[#1a1a1a]/10 pb-2">Pantry Items</h3>
                        <ul className="space-y-2 font-sans text-sm text-[#1a1a1a]/60">
                          {recipe.extraIngredients.map((item, i) => (
                            <li key={i}>+ {item}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  {/* Main: Steps */}
                  <div className="md:col-span-2 space-y-8">
                    <section className="space-y-6">
                      <h3 className="text-xl font-bold border-b border-[#1a1a1a]/10 pb-2">Instructions</h3>
                      <div className="space-y-8">
                        {recipe.steps.map((step, i) => (
                          <div key={i} className="flex gap-6">
                            <span className="text-4xl font-light text-[#5A5A40]/20 shrink-0 tabular-nums">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="text-lg leading-relaxed pt-1">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {recipe.chefTip && (
                      <section className="bg-[#f5f5f0] p-6 rounded-2xl border-l-4 border-[#5A5A40] space-y-2">
                        <div className="flex items-center gap-2 font-sans font-bold text-[#5A5A40] uppercase text-xs tracking-widest">
                          <Sparkles size={14} />
                          Chef's Secret Tip
                        </div>
                        <p className="italic text-[#1a1a1a]/80">
                          "{recipe.chefTip}"
                        </p>
                      </section>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="text-center space-y-6 py-8">
                <p className="text-xl italic text-[#5A5A40]">
                  Would you like another recipe with these ingredients or different ones? 😊
                </p>
                <button
                  onClick={reset}
                  className="px-8 py-4 bg-white border-2 border-[#5A5A40] text-[#5A5A40] rounded-full font-sans font-bold hover:bg-[#5A5A40] hover:text-white transition-all shadow-lg shadow-black/5"
                >
                  Try Another Recipe
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-[#1a1a1a]/40 font-sans text-sm">
        <p>© {new Date().getFullYear()} Smart Kitchen Chef • Your AI Culinary Partner</p>
      </footer>
    </div>
  );
}
