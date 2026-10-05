import data from "@/content/recipes.json";

export type Recipe = {
  title: string;
  category: string;
  image: string | null;
  prepTime: string;
  cookTime: string;
  ovenTemp: string;
  difficulty: string;
  ingredients: string[];
  directions: string;
};

export type RecipesContent = {
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  categories: string[];
  recipes: Recipe[];
  submitTitle: string;
  submitSubtitle: string;
};

// JSON has no `image` field on recipes; normalize to the Recipe shape.
export const recipesDefaults = {
  ...(data as Omit<RecipesContent, "recipes">),
  recipes: (data as { recipes: Omit<Recipe, "image">[] }).recipes.map((r) => ({ ...r, image: null })),
} as RecipesContent;
