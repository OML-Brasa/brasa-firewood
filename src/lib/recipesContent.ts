import data from "@/content/recipes.json";

export type Recipe = {
  title: string;
  category: string;
  region: string | null;
  serves: string | null;
  image: string | null;
  pdf: string | null;
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

// JSON recipes have no `image`, `pdf`, `region` or `serves`; normalize to the Recipe shape.
export const recipesDefaults = {
  ...(data as Omit<RecipesContent, "recipes">),
  recipes: (data as { recipes: Omit<Recipe, "image" | "pdf" | "region" | "serves">[] }).recipes.map((r) => ({
    ...r,
    image: null,
    pdf: null,
    region: null,
    serves: null,
  })),
} as RecipesContent;
