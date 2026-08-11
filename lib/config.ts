export const siteConfig = {
  name: "Fyndra Labs",
  legalName: "Fyndra Labs LLC",
  tagline: "Software that makes everyday life simpler.",
  description:
    "Fyndra Labs creates simple, useful, and thoughtfully designed software products and mobile applications that solve real-world problems.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fyndralabs.com",
  
  supportEmail: "support@fyndralabs.com",
  contactEmail: "contact@fyndralabs.com",
  
  // Official Brand Assets
  assets: {
    icon: "/brand/fyndra-labs-icon.png",
    logo: "/brand/fyndra-labs-logo.png",
    favicon: "/brand/favicon.png",
    ogImage: "/brand/fyndra-labs-og.png",
  },

  socialLinks: {
    twitter: "",
    github: "",
    linkedin: "",
    googlePlay: "",
  },

  brandColors: {
    primary: "#0c8ee9",
    primaryHover: "#0270c7",
    darkBackground: "#0b0f17",
    lightBackground: "#ffffff",
  },

  navLinks: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
