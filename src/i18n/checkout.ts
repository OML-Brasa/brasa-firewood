import type { Locale } from "@/lib/i18n";

/**
 * Interface-string dictionary for the hard-coded cart / checkout / confirmation
 * UI text. `en` defines the shape; `es` must mirror it (enforced by the type).
 * Product/CMS values, brand & model names, units, prices and numbers stay as-is.
 */
const en = {
  // Cart + checkout shared
  emptyCart: "Your cart is empty",
  browseShop: "Browse the Shop",
  subtotal: "Subtotal",
  discount: "Discount",
  shipping: "Shipping",
  estimatedSubtotal: "Estimated Subtotal",
  deliveryAddress: "Delivery Address",
  continueShopping: "Continue Shopping",

  // Cart
  cartTitle: "Your Cart",
  itemSingular: "item",
  itemPlural: "items",
  emptyCartHint: "Add an oven or accessory to get started.",
  decreaseQty: "Decrease quantity",
  increaseQty: "Increase quantity",
  completeSetup: "Complete Your Setup",
  viewAllAccessories: "View All Accessories",
  edit: "Edit",
  remove: "Remove",
  discountCode: "Discount code",
  apply: "Apply",
  promoInvalid: "That code isn’t valid. Try BRASA10 or BRASA15.",
  promoCodePrefix: "Code",
  promoApplied: "applied —",
  promoOff: "% off.",
  promoRemove: "remove",
  orderSummary: "Order Summary",
  quotedAfterCheckout: "Quoted after checkout",
  proceedToCheckout: "Proceed to Checkout",
  freightNoteCart:
    "These ovens ship by freight — you’ll request a shipping quote at checkout. No payment is taken online.",

  // Checkout
  checkoutTitle: "Checkout",
  requestQuoteTitle: "Request a Shipping Quote",
  requestQuoteSubtitle:
    "No payment today — we’ll quote freight to your area and follow up.",
  formError:
    "Please fill in your email, phone, and full shipping address so we can quote freight.",
  contactInfo: "Contact Information",
  emailAddress: "Email Address",
  emailPlaceholder: "yourname@example.com",
  optInLabel: "Email me with exclusive news, refractory care tips, and offers",
  deliveryAddressHint: "We use this to calculate your freight quote.",
  firstName: "First Name",
  firstNamePlaceholder: "John",
  lastName: "Last Name",
  lastNamePlaceholder: "Doe",
  streetAddress: "Street Address",
  streetPlaceholder: "123 Woodfired Way",
  aptLabel: "Apartment, suite, unit, etc. (optional)",
  aptPlaceholder: "Suite 4B",
  city: "City",
  cityPlaceholder: "San Juan",
  stateRegion: "State / Region",
  selectPlaceholder: "Select…",
  regionPlaceholder: "Region",
  zipPostal: "ZIP / Postal",
  zipPlaceholder: "00907",
  countryRegion: "Country/Region",
  phoneNumber: "Phone Number",
  phonePlaceholder: "(555) 000-0000",
  yourRequest: "Your Request",
  editCart: "Edit Cart",
  quotedAfterRequest: "Quoted after request",
  sending: "Sending…",
  requestShippingQuote: "Request Shipping Quote",
  freightNoteCheckout:
    "You won’t be charged now. We’ll review your request and reply with a freight quote for your area.",

  // Stepper
  home: "Home",
  stepCart: "Cart",
  stepCheckout: "Checkout",
  stepConfirmation: "Confirmation",

  // Order confirmed
  noRecentRequest: "No recent request",
  noRecentHint: "Looks like you haven’t requested a quote in this session.",
  quoteRequested: "Quote Requested!",
  thanksPrefix: "Thanks",
  thanksBody:
    ". We’ve received your request and will follow up with a shipping quote to ",
  yourInbox: "your inbox",
  yourRequestId: "Your Request ID",
  requestNo: "Request #",
  dateLabel: "Date:",
  statusLabel: "Status:",
  statusPending: "Pending shipping quote",
  requestedItems: "Requested Items",
  qty: "Qty:",
  phoneLabel: "Phone:",
  addressNote:
    "Your shipping method, cost, and timeline will be included in the quote we send.",
  estimate: "Estimate",
  quotedSeparately: "Quoted separately",
  estimateNote:
    "Final total includes freight, which we’ll quote for your area. No payment has been taken.",
  whatsNext: "What’s Next?",
  needAssistance: "Need Assistance?",
  callLabel: "Call:",
  emailLabel: "Email:",
};

type Dict = typeof en;

const es: Dict = {
  // Cart + checkout shared
  emptyCart: "Tu carrito está vacío",
  browseShop: "Explorar la tienda",
  subtotal: "Subtotal",
  discount: "Descuento",
  shipping: "Envío",
  estimatedSubtotal: "Subtotal estimado",
  deliveryAddress: "Dirección de entrega",
  continueShopping: "Seguir comprando",

  // Cart
  cartTitle: "Tu carrito",
  itemSingular: "artículo",
  itemPlural: "artículos",
  emptyCartHint: "Añade un horno o accesorio para comenzar.",
  decreaseQty: "Disminuir cantidad",
  increaseQty: "Aumentar cantidad",
  completeSetup: "Completa tu configuración",
  viewAllAccessories: "Ver todos los accesorios",
  edit: "Editar",
  remove: "Quitar",
  discountCode: "Código de descuento",
  apply: "Aplicar",
  promoInvalid: "Ese código no es válido. Prueba BRASA10 o BRASA15.",
  promoCodePrefix: "Código",
  promoApplied: "aplicado —",
  promoOff: "% de descuento.",
  promoRemove: "quitar",
  orderSummary: "Resumen del pedido",
  quotedAfterCheckout: "Se cotiza después del pago",
  proceedToCheckout: "Continuar al pago",
  freightNoteCart:
    "Estos hornos se envían por flete — solicitarás una cotización de envío al finalizar la compra. No se cobra ningún pago en línea.",

  // Checkout
  checkoutTitle: "Finalizar compra",
  requestQuoteTitle: "Solicita una cotización de envío",
  requestQuoteSubtitle:
    "Hoy no pagas nada — cotizaremos el flete a tu zona y te contactaremos.",
  formError:
    "Completa tu correo electrónico, teléfono y dirección de envío completa para poder cotizar el flete.",
  contactInfo: "Información de contacto",
  emailAddress: "Correo electrónico",
  emailPlaceholder: "yourname@example.com",
  optInLabel:
    "Quiero recibir por correo electrónico noticias exclusivas, consejos de cuidado del horno y ofertas",
  deliveryAddressHint: "Usamos esto para calcular tu cotización de flete.",
  firstName: "Nombre",
  firstNamePlaceholder: "Juan",
  lastName: "Apellido",
  lastNamePlaceholder: "Pérez",
  streetAddress: "Dirección",
  streetPlaceholder: "Calle Fuego 123",
  aptLabel: "Apartamento, suite, unidad, etc. (opcional)",
  aptPlaceholder: "Apto. 4B",
  city: "Ciudad",
  cityPlaceholder: "San Juan",
  stateRegion: "Estado / Región",
  selectPlaceholder: "Selecciona…",
  regionPlaceholder: "Región",
  zipPostal: "Código postal",
  zipPlaceholder: "00907",
  countryRegion: "País/Región",
  phoneNumber: "Número de teléfono",
  phonePlaceholder: "(555) 000-0000",
  yourRequest: "Tu solicitud",
  editCart: "Editar carrito",
  quotedAfterRequest: "Se cotiza después de la solicitud",
  sending: "Enviando…",
  requestShippingQuote: "Solicitar cotización de envío",
  freightNoteCheckout:
    "No se te cobrará ahora. Revisaremos tu solicitud y te responderemos con una cotización de flete para tu zona.",

  // Stepper
  home: "Inicio",
  stepCart: "Carrito",
  stepCheckout: "Finalizar compra",
  stepConfirmation: "Confirmación",

  // Order confirmed
  noRecentRequest: "No hay solicitud reciente",
  noRecentHint: "Parece que no has solicitado una cotización en esta sesión.",
  quoteRequested: "¡Cotización solicitada!",
  thanksPrefix: "Gracias",
  thanksBody:
    ". Recibimos tu solicitud y te contactaremos con una cotización de envío a ",
  yourInbox: "tu correo",
  yourRequestId: "Tu número de solicitud",
  requestNo: "Solicitud #",
  dateLabel: "Fecha:",
  statusLabel: "Estado:",
  statusPending: "Cotización de envío pendiente",
  requestedItems: "Artículos solicitados",
  qty: "Cantidad:",
  phoneLabel: "Teléfono:",
  addressNote:
    "Tu método de envío, costo y plazo se incluirán en la cotización que te enviemos.",
  estimate: "Estimado",
  quotedSeparately: "Se cotiza por separado",
  estimateNote:
    "El total final incluye el flete, que cotizaremos para tu zona. No se ha cobrado ningún pago.",
  whatsNext: "¿Qué sigue?",
  needAssistance: "¿Necesitas ayuda?",
  callLabel: "Llama:",
  emailLabel: "Correo:",
};

export const checkoutUI: Record<Locale, Dict> = { en, es };
