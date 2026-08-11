export interface ProductFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface Product {
  name: string;
  slug: string;
  category: string;
  tagline: string;
  shortDescription: string;
  description: string;
  logo: string;
  icon: string;
  accentColor: string;
  screenshots: string[];
  features: ProductFeature[];
  whyItExists: {
    problem: string;
    solution: string;
  };
  howItWorks: HowItWorksStep[];
  playStoreUrl?: string;
  websiteUrl?: string;
  isFeatured: boolean;
  status: "Active" | "In Development";
  releaseYear: string;
}

export const products: Product[] = [
  {
    name: "SplitMate",
    slug: "splitmate",
    category: "Expense Management",
    tagline: "Split expenses, manage shared costs, and track balances effortlessly.",
    shortDescription:
      "Split expenses, manage shared costs, and keep track of who owes what — without the usual confusion.",
    description:
      "SplitMate is a mobile application developed by Fyndra Labs that simplifies shared expense splitting, group balances, and debt resolution.",
    logo: "/products/splitmate/icon.svg",
    icon: "/products/splitmate/icon.svg",
    accentColor: "#0c8ee9",
    screenshots: [
      "/products/splitmate/screenshot-01.png",
      "/products/splitmate/screenshot-02.png",
      "/products/splitmate/screenshot-03.png",
      "/products/splitmate/screenshot-04.png",
      "/products/splitmate/screenshot-05.png",
    ],
    features: [
      {
        title: "Split Expenses Easily",
        description:
          "Equal splits, custom percentages, or exact amounts — handle any shared bill in seconds.",
        icon: "Receipt",
      },
      {
        title: "Track Balances",
        description:
          "Instant overview of overall balances between friends or within groups with zero mathematical errors.",
        icon: "Scale",
      },
      {
        title: "Manage Groups",
        description:
          "Organize shared costs by trip, apartment, dinner party, or recurring monthly expenses.",
        icon: "Users",
      },
      {
        title: "Invite Friends & Sync",
        description:
          "Seamlessly collaborate with group members using real-time synchronization.",
        icon: "UserPlus",
      },
      {
        title: "Keep Expenses Organized",
        description:
          "Categorize spending, attach receipt details, and filter transaction logs effortlessly.",
        icon: "FolderKanban",
      },
      {
        title: "Simple & Transparent",
        description:
          "Smart debt simplification algorithm reduces total transactions needed to settle balances.",
        icon: "Sparkles",
      },
    ],
    whyItExists: {
      problem:
        "Group travel, shared housing, and casual outings often devolve into messy spreadsheets, forgotten payments, and uncomfortable money conversations.",
      solution:
        "SplitMate eliminates friction with an intuitive mobile experience designed for instant expense logging, automatic debt simplification, and clear balance transparency.",
    },
    howItWorks: [
      {
        step: 1,
        title: "Create a Group",
        description: "Set up a group for your trip, housemates, or event in seconds.",
      },
      {
        step: 2,
        title: "Log Shared Expenses",
        description: "Add bills as they happen, specifying who paid and how to split.",
      },
      {
        step: 3,
        title: "See Instant Balances",
        description: "SplitMate automatically calculates net balances and minimizes total repayments.",
      },
      {
        step: 4,
        title: "Settle Up Effortlessly",
        description: "Mark balances as settled with a single tap as debts are repaid.",
      },
    ],
    // Set official Google Play URL here when public
    playStoreUrl: "",
    websiteUrl: "https://fyndralabs.com/products/splitmate",
    isFeatured: true,
    status: "Active",
    releaseYear: "2026",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}
