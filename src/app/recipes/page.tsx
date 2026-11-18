import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/Newsletter";
import { RecipesClient } from "@/components/RecipesClient";
import { getLocale } from "@/lib/getLocale";
import { recipesDefaults, type Recipe, type RecipesContent } from "@/lib/recipesContent";
import { fetchSeo, seoMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { localeDoc } from "@/sanity/lib/locale";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = await fetchSeo("recipesPage", { lang: locale });
  return seoMetadata(seo, {
    title: locale === "es" ? "Recetas" : "Recipes",
    description:
      "Wood-fired recipes for your Brasa oven — pizza, bread, roasts and more, with prep times, temperatures and step-by-step directions.",
  });
}

const query = `${localeDoc("recipesPage")}{
  heroTitle, heroSubtitle, searchPlaceholder, categories,
  recipes[]{ title, category, region, serves, image, "pdf": pdf.asset->url, prepTime, cookTime, ovenTemp, difficulty, ingredients, directions },
  submitTitle, submitSubtitle, submitEmail
}`;

type DocRecipe = Omit<Recipe, "image" | "pdf"> & { image?: Parameters<typeof urlFor>[0]; pdf?: string | null };

export default async function RecipesPage() {
  const locale = await getLocale();
  const doc = await client.fetch(query, { lang: locale }).catch(() => null);
  const recipes: Recipe[] = doc?.recipes?.length
    ? doc.recipes.map((r: DocRecipe) => ({ ...r, image: r.image ? urlFor(r.image).width(800).auto("format").url() : null, pdf: r.pdf ?? null }))
    : recipesDefaults.recipes;
  const content: RecipesContent = {
    heroTitle: doc?.heroTitle ?? recipesDefaults.heroTitle,
    heroSubtitle: doc?.heroSubtitle ?? recipesDefaults.heroSubtitle,
    searchPlaceholder: doc?.searchPlaceholder ?? recipesDefaults.searchPlaceholder,
    categories: doc?.categories?.length ? doc.categories : recipesDefaults.categories,
    recipes,
    submitTitle: doc?.submitTitle ?? recipesDefaults.submitTitle,
    submitSubtitle: doc?.submitSubtitle ?? recipesDefaults.submitSubtitle,
    submitEmail: doc?.submitEmail ?? recipesDefaults.submitEmail,
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
