import { type SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { checkoutSettings } from "./checkoutSettings";
import { contactPage } from "./contactPage";
import { faqPage } from "./faqPage";
import { homePage } from "./homePage";
import { product } from "./product";
import { recipesPage } from "./recipesPage";
import { shopPage } from "./shopPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, aboutPage, shopPage, faqPage, contactPage, recipesPage, product, checkoutSettings],
};
