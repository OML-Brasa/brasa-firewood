/** Placeholder copy for the legal pages, shown until Exel provides final text
 *  (editable in Sanity → Legal Pages). Generic, non-binding starter language. */
import type { Locale } from "@/lib/i18n";

export type LegalSection = { heading: string; paras: string[] };

export const privacyPlaceholder = {
  title: "Privacy Policy",
  updated: "Placeholder — pending final copy",
  intro:
    "This Privacy Policy explains how Brasa collects, uses, and protects the information you share with us when you visit our website or purchase an oven. This is placeholder text and will be replaced with our final policy.",
  sections: [
    {
      heading: "Information We Collect",
      paras: [
        "We may collect information you provide directly — such as your name, email address, phone number, shipping address, and order details — when you contact us, subscribe to our newsletter, or place an order.",
        "We may also collect limited technical information automatically, such as your browser type and pages visited, to help us improve the site.",
      ],
    },
    {
      heading: "How We Use Your Information",
      paras: [
        "We use your information to process and ship orders, respond to inquiries, send updates you have requested, and improve our products and services.",
      ],
    },
    {
      heading: "Sharing of Information",
      paras: [
        "We do not sell your personal information. We share it only with service providers who help us operate our business — such as payment processors and shipping carriers — and only as needed to fulfill your order.",
      ],
    },
    {
      heading: "Your Choices",
      paras: [
        "You may unsubscribe from marketing emails at any time, and you may contact us to request access to, correction of, or deletion of your personal information.",
      ],
    },
    {
      heading: "Contact Us",
      paras: [
        "Questions about this policy can be sent to sales@brasaoven.com.",
      ],
    },
  ] as LegalSection[],
};

export const termsPlaceholder = {
  title: "Terms of Use",
  updated: "Placeholder — pending final copy",
  intro:
    "These Terms of Use govern your access to and use of the Brasa website and your purchase of our products. This is placeholder text and will be replaced with our final terms.",
  sections: [
    {
      heading: "Use of This Site",
      paras: [
        "By using this website you agree to use it lawfully and not to misuse, disrupt, or attempt to gain unauthorized access to any part of it.",
      ],
    },
    {
      heading: "Products and Pricing",
      paras: [
        "We work to keep product descriptions, availability, and pricing accurate, but errors can occur. We reserve the right to correct errors and to update information at any time without notice.",
      ],
    },
    {
      heading: "Orders and Shipping",
      paras: [
        "All orders are subject to acceptance and availability. Shipping is quoted per location; freight timelines and costs are confirmed before your order is finalized.",
      ],
    },
    {
      heading: "Intellectual Property",
      paras: [
        "All content on this site — including text, images, logos, and designs — is the property of Brasa and may not be reproduced without permission.",
      ],
    },
    {
      heading: "Contact Us",
      paras: [
        "Questions about these terms can be sent to sales@brasaoven.com.",
      ],
    },
  ] as LegalSection[],
};

export const privacyPlaceholderEs = {
  title: "Política de Privacidad",
  updated: "Texto provisional — pendiente de la versión final",
  intro:
    "Esta Política de Privacidad explica cómo Brasa recopila, usa y protege la información que compartes con nosotros al visitar nuestro sitio web o comprar un horno. Este es un texto provisional y será reemplazado por nuestra política final.",
  sections: [
    {
      heading: "Información que recopilamos",
      paras: [
        "Podemos recopilar la información que nos facilitas directamente — como tu nombre, correo electrónico, número de teléfono, dirección de envío y los detalles de tu pedido — cuando nos contactas, te suscribes a nuestro boletín o realizas una compra.",
        "También podemos recopilar de forma automática cierta información técnica limitada, como el tipo de navegador y las páginas que visitas, para ayudarnos a mejorar el sitio.",
      ],
    },
    {
      heading: "Cómo usamos tu información",
      paras: [
        "Usamos tu información para procesar y enviar pedidos, responder a tus consultas, enviarte las novedades que hayas solicitado y mejorar nuestros productos y servicios.",
      ],
    },
    {
      heading: "Compartir información",
      paras: [
        "No vendemos tu información personal. La compartimos únicamente con proveedores de servicios que nos ayudan a operar nuestro negocio — como procesadores de pago y transportistas — y solo en la medida necesaria para completar tu pedido.",
      ],
    },
    {
      heading: "Tus opciones",
      paras: [
        "Puedes darte de baja de los correos de marketing en cualquier momento, y puedes contactarnos para solicitar acceso, corrección o eliminación de tu información personal.",
      ],
    },
    {
      heading: "Contáctanos",
      paras: [
        "Si tienes preguntas sobre esta política, escríbenos a sales@brasaoven.com.",
      ],
    },
  ] as LegalSection[],
};

export const termsPlaceholderEs = {
  title: "Términos de Uso",
  updated: "Texto provisional — pendiente de la versión final",
  intro:
    "Estos Términos de Uso rigen tu acceso y uso del sitio web de Brasa y la compra de nuestros productos. Este es un texto provisional y será reemplazado por nuestros términos finales.",
  sections: [
    {
      heading: "Uso de este sitio",
      paras: [
        "Al usar este sitio web aceptas utilizarlo de forma lícita y no hacer un uso indebido, interrumpirlo ni intentar acceder sin autorización a ninguna parte de él.",
      ],
    },
    {
      heading: "Productos y precios",
      paras: [
        "Procuramos mantener exactas las descripciones, la disponibilidad y los precios de los productos, pero pueden ocurrir errores. Nos reservamos el derecho de corregir errores y actualizar la información en cualquier momento sin previo aviso.",
      ],
    },
    {
      heading: "Pedidos y envíos",
      paras: [
        "Todos los pedidos están sujetos a aceptación y disponibilidad. El envío se cotiza según la ubicación; los tiempos y costos de flete se confirman antes de finalizar tu pedido.",
      ],
    },
    {
      heading: "Propiedad intelectual",
      paras: [
        "Todo el contenido de este sitio — incluidos textos, imágenes, logotipos y diseños — es propiedad de Brasa y no puede reproducirse sin autorización.",
      ],
    },
    {
      heading: "Contáctanos",
      paras: [
        "Si tienes preguntas sobre estos términos, escríbenos a sales@brasaoven.com.",
      ],
    },
  ] as LegalSection[],
};

export const getPrivacyPlaceholder = (locale: Locale) => (locale === "es" ? privacyPlaceholderEs : privacyPlaceholder);
export const getTermsPlaceholder = (locale: Locale) => (locale === "es" ? termsPlaceholderEs : termsPlaceholder);
