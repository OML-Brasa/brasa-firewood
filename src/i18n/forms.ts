import type { Locale } from "@/lib/i18n";

/**
 * Interface-string dictionary for hard-coded form / content-chrome UI text in
 * the Contact, Newsletter, Recipes, and FAQ client components. Editable CMS
 * content (Sanity) is translated separately and is not included here.
 *
 * `en` defines the shape; `es` must mirror it (enforced by the type below).
 */
const en = {
  // Contact form
  contactSentTitle: "Message sent",
  contactSentThanksPrefix: "Thanks, ",
  contactSentMid: ". Our team will get back to you at ",
  contactSentSuffix: " shortly.",
  contactError: "Please fill in your name, email, subject, and message.",
  firstName: "First Name",
  firstNamePlaceholder: "e.g. John",
  lastName: "Last Name",
  lastNamePlaceholder: "e.g. Smith",
  emailAddress: "Email Address",
  emailPlaceholder: "e.g. john@example.com",
  phoneOptional: "Phone Number (Optional)",
  phonePlaceholder: "e.g. (555) 000-0000",
  subject: "Subject",
  subjectSelect: "Select a subject...",
  yourMessage: "Your Message",
  messagePlaceholder: "Tell us about your project, culinary needs, or ask a question...",
  sendMessage: "Send Message",
  businessHours: "Business Hours",
  // Contact mailto body labels (human-readable)
  bodyName: "Name",
  bodyEmail: "Email",
  bodyPhone: "Phone",

  // Newsletter
  newsletterTitle: "Join the Brasa Community",
  newsletterCopy: "Recipes, restocks, and the occasional fire story — straight to your inbox.",
  newsletterThanks: "Thanks for subscribing — we’ll be in touch soon.",
  newsletterError: "Something went wrong. Please try again in a moment.",
  newsletterPlaceholder: "Enter your email address",
  subscribe: "Subscribe",

  // Recipes
  recipesBreadcrumb: "Recipes",
  noRecipesMatch: "No recipes match your search.",
  openRecipePdfPrefix: "Open ",
  openRecipePdfSuffix: " recipe PDF",
  recipeServes: "Serves",
  recipePrepTime: "Prep Time",
  recipeCookTime: "Cook Time",
  recipeOvenTemp: "Oven Temp",
  recipeDifficulty: "Difficulty",
  ingredients: "Ingredients",
  directions: "Directions",
  downloadRecipePdf: "Download recipe PDF",
  submitRecipe: "Submit Recipe",
  recipeSubmissionSubject: "Recipe Submission",
  recipeSubmissionBody:
    "Recipe name:\n\nServes:\n\nOven temperature:\n\nIngredients:\n- \n- \n\nMethod:\n1. \n2. \n\nYour name:\n\nAttach a photo of the finished dish if you have one — thank you!",

  // FAQ
  faqBreadcrumb: "FAQ",
  noAnswersPrefix: "No answers match ",
  tryDifferentSearch: "Try a different search.",
  contactUs: "Contact Us",
  requestQuote: "Request a Quote",
};

type Dict = typeof en;

const es: Dict = {
  // Contact form
  contactSentTitle: "Mensaje enviado",
  contactSentThanksPrefix: "Gracias, ",
  contactSentMid: ". Nuestro equipo se pondrá en contacto contigo en ",
  contactSentSuffix: " pronto.",
  contactError: "Por favor completa tu nombre, correo electrónico, asunto y mensaje.",
  firstName: "Nombre",
  firstNamePlaceholder: "p. ej. Juan",
  lastName: "Apellido",
  lastNamePlaceholder: "p. ej. Pérez",
  emailAddress: "Correo electrónico",
  emailPlaceholder: "p. ej. juan@ejemplo.com",
  phoneOptional: "Número de teléfono (opcional)",
  phonePlaceholder: "p. ej. (555) 000-0000",
  subject: "Asunto",
  subjectSelect: "Selecciona un asunto...",
  yourMessage: "Tu mensaje",
  messagePlaceholder: "Cuéntanos sobre tu proyecto, tus necesidades culinarias, o haznos una pregunta...",
  sendMessage: "Enviar mensaje",
  businessHours: "Horario de atención",
  // Contact mailto body labels (human-readable)
  bodyName: "Nombre",
  bodyEmail: "Correo electrónico",
  bodyPhone: "Teléfono",

  // Newsletter
  newsletterTitle: "Únete a la comunidad Brasa",
  newsletterCopy: "Recetas, reabastecimientos y alguna que otra historia de fuego — directo a tu correo.",
  newsletterThanks: "Gracias por suscribirte — pronto estaremos en contacto.",
  newsletterError: "Algo salió mal. Por favor inténtalo de nuevo en un momento.",
  newsletterPlaceholder: "Ingresa tu correo electrónico",
  subscribe: "Suscribirse",

  // Recipes
  recipesBreadcrumb: "Recetas",
  noRecipesMatch: "No hay recetas que coincidan con tu búsqueda.",
  openRecipePdfPrefix: "Abrir el PDF de la receta ",
  openRecipePdfSuffix: "",
  recipeServes: "Porciones",
  recipePrepTime: "Tiempo de preparación",
  recipeCookTime: "Tiempo de cocción",
  recipeOvenTemp: "Temp. del horno",
  recipeDifficulty: "Dificultad",
  ingredients: "Ingredientes",
  directions: "Instrucciones",
  downloadRecipePdf: "Descargar receta en PDF",
  submitRecipe: "Enviar receta",
  recipeSubmissionSubject: "Envío de receta",
  recipeSubmissionBody:
    "Nombre de la receta:\n\nPorciones:\n\nTemperatura del horno:\n\nIngredientes:\n- \n- \n\nMétodo:\n1. \n2. \n\nTu nombre:\n\nAdjunta una foto del plato terminado si tienes una — ¡gracias!",

  // FAQ
  faqBreadcrumb: "Preguntas frecuentes",
  noAnswersPrefix: "No hay respuestas para ",
  tryDifferentSearch: "Prueba otra búsqueda.",
  contactUs: "Contáctanos",
  requestQuote: "Solicitar cotización",
};

export const formsUI: Record<Locale, Dict> = { en, es };
