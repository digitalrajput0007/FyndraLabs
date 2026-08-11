export const siteConfig = {
  name: "Fyndra Labs",
  legalName: "Fyndra Labs LLC",
  tagline: "Software that makes everyday life simpler.",
  description:
    "Fyndra Labs creates simple, useful, and thoughtfully designed software products and mobile applications that solve real-world problems.",
  url: "https://fyndralabs.com",
  
  // Single centralized support email configuration
  supportEmail: "support@fyndralabs.com",
  contactEmail: "contact@fyndralabs.com",
  
  // Centralized Brand Asset Paths
  assets: {
    logo: "/brand/logo.svg",
    logoMark: "/brand/logo-mark.svg",
    favicon: "/brand/logo-mark.svg",
    ogImage: "/brand/og-image.svg",
  },

  // Social links - populated dynamically if non-empty
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
