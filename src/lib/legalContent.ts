/** Placeholder copy for the legal pages, shown until Exel provides final text
 *  (editable in Sanity → Legal Pages). Generic, non-binding starter language. */

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
        "Questions about this policy can be sent to support@brasaoutdoor.com.",
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
        "Questions about these terms can be sent to support@brasaoutdoor.com.",
      ],
    },
  ] as LegalSection[],
};
