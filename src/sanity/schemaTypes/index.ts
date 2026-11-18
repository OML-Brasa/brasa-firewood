import { type SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { carePage } from "./carePage";
import { checkoutSettings } from "./checkoutSettings";
import { contactPage } from "./contactPage";
import { faqPage } from "./faqPage";
import { homePage } from "./homePage";
import { legalPage } from "./legalPage";
import { product } from "./product";
import { recipesPage } from "./recipesPage";
import { shopPage } from "./shopPage";
import { seo } from "./objects/seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, aboutPage, shopPage, faqPage, contactPage, recipesPage, carePage, legalPage, product, checkoutSettings, seo],
};
