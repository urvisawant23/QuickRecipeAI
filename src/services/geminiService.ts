import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Recipe {
  dishName: string;
  ingredientsUsed: string[];
  extraIngredients: string[];
  cookingTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  steps: string[];
  chefTip: string;
}

export async function generateRecipe(ingredients: string, preferences: string = ""): Promise<Recipe> {
  const prompt = `You are a world-class chef. Create a recipe using these ingredients: ${ingredients}. 
  User preferences/requests: ${preferences}.
  
  Follow these rules:
  1. Use mostly the provided ingredients.
  2. You can add common pantry items (salt, pepper, oil, butter, water).
  3. Be creative but realistic.
  4. If the ingredients are limited, make it simple.
  5. If the combination is weird, make it interesting.
  
  Return the response in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
          extraIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          cookingTime: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          chefTip: { type: Type.STRING },
        },
        required: ["dishName", "ingredientsUsed", "extraIngredients", "cookingTime", "difficulty", "steps", "chefTip"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as Recipe;
}
