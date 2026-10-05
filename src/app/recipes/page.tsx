import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { RecipesClient } from "@/components/RecipesClient";
import { recipesDefaults, type Recipe, type RecipesContent } from "@/lib/recipesContent";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

const query = `*[_type == "recipesPage"][0]{
  heroTitle, heroSubtitle, searchPlaceholder, categories,
  recipes[]{ title, category, image, prepTime, cookTime, ovenTemp, difficulty, ingredients, directions },
  submitTitle, submitSubtitle
}`;

type DocRecipe = Omit<Recipe, "image"> & { image?: Parameters<typeof urlFor>[0] };

export default async function RecipesPage() {
  const doc = await client.fetch(query).catch(() => null);
  const recipes: Recipe[] = doc?.recipes?.length
    ? doc.recipes.map((r: DocRecipe) => ({ ...r, image: r.image ? urlFor(r.image).width(800).auto("format").url() : null }))
    : recipesDefaults.recipes;
  const content: RecipesContent = {
    heroTitle: doc?.heroTitle ?? recipesDefaults.heroTitle,
    heroSubtitle: doc?.heroSubtitle ?? recipesDefaults.heroSubtitle,
    searchPlaceholder: doc?.searchPlaceholder ?? recipesDefaults.searchPlaceholder,
    categories: doc?.categories?.length ? doc.categories : recipesDefaults.categories,
    recipes,
    submitTitle: doc?.submitTitle ?? recipesDefaults.submitTitle,
    submitSubtitle: doc?.submitSubtitle ?? recipesDefaults.submitSubtitle,
  };
  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <RecipesClient content={content} />
      <Newsletter />
      <Footer />
    </div>
  );
}
