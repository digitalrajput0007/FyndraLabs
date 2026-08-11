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

export interface ProductFAQItem {
  question: string;
  answer: string;
}

export interface ProductUseCase {
  title: string;
  description: string;
  iconName: string;
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
  heroImage?: string;
  screenshots: string[];
  features: ProductFeature[];
  whyItExists: {
    problem: string;
    solution: string;
  };
  howItWorks: HowItWorksStep[];
  faq: ProductFAQItem[];
  useCases: ProductUseCase[];
  playStoreUrl?: string;
  websiteUrl?: string;
  supportEmail: string;
  privacyUrl: string;
  termsUrl: string;
  deleteAccountUrl: string;
  isFeatured: boolean;
  status: "Active" | "In Development";
  releaseYear: string;
}

export const products: Product[] = [
  {
    name: "SplitMate",
    slug: "splitmate",
    category: "Expense Management",
    tagline: "Shared expenses, simplified.",
    shortDescription:
      "Split expenses, track balances, manage groups, and see exactly who owes what.",
    description:
      "SplitMate is an intuitive mobile application created by Fyndra Labs that simplifies shared bill splitting, group balances, and debt resolution.",
    logo: "/products/splitmate/logo.png",
    icon: "/products/splitmate/logo.png",
    heroImage: "/products/splitmate/hero.jpg",
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
        title: "Split Expenses",
        description:
          "Track shared expenses and divide costs clearly between group members.",
        icon: "Receipt",
      },
      {
        title: "Track Balances",
        description:
          "See who owes whom at a glance with clear, accurate balance updates.",
        icon: "Scale",
      },
      {
        title: "Manage Groups",
        description:
          "Keep trips, roommates, dinners, and other shared expenses organized.",
        icon: "Users",
      },
      {
        title: "Settle Up",
        description:
          "Make it easier to understand and settle outstanding balances effortlessly.",
        icon: "Sparkles",
      },
    ],
    whyItExists: {
      problem:
        "Group travel, shared housing, and casual dinners often turn into confusing spreadsheets, forgotten payments, and awkward money conversations.",
      solution:
        "SplitMate eliminates friction with a clean mobile experience designed for instant expense logging, group tracking, and balance settlement.",
    },
    howItWorks: [
      {
        step: 1,
        title: "Create a Group",
        description: "Set up a group for your trip, housemates, or event in seconds.",
      },
      {
        step: 2,
        title: "Add an Expense",
        description: "Log bills as they happen, specifying who paid and who shares the cost.",
      },
      {
        step: 3,
        title: "Split the Expense",
        description: "SplitMate automatically divides the bill and updates individual shares.",
      },
      {
        step: 4,
        title: "Track & Settle Balances",
        description: "Review net balances and mark items as settled when payments are made.",
      },
    ],
    faq: [
      {
        question: "What is SplitMate?",
        answer:
          "SplitMate is a mobile application developed by Fyndra Labs designed to help friends, roommates, and groups track shared expenses and settle balances simply.",
      },
      {
        question: "How does SplitMate calculate group balances?",
        answer:
          "When you add an expense, SplitMate updates the net balance for each group member so everyone knows exactly what they owe or are owed.",
      },
      {
        question: "Is SplitMate free to use?",
        answer:
          "Yes, SplitMate core expense splitting and group tracking features are free to use.",
      },
      {
        question: "How do I request account or data deletion?",
        answer:
          "You can request deletion of your account and personal data anytime by visiting the Delete Account page at /products/splitmate/delete-account.",
      },
    ],
    useCases: [
      {
        title: "Trip",
        description: "Keep track of flights, hotels, meals, and activities on group vacations.",
        iconName: "Plane",
      },
      {
        title: "Family",
        description: "Manage shared household expenses, family outings, and group gifts.",
        iconName: "Users",
      },
      {
        title: "Couple",
        description: "Track shared living costs, date nights, and joint budgets seamlessly.",
        iconName: "Heart",
      },
      {
        title: "Flatmate",
        description: "Share rent, utility bills, groceries, and household supplies effortlessly.",
        iconName: "Home",
      },
      {
        title: "& Other",
        description: "Organize dinners, casual hangouts, office teams, and event expenses.",
        iconName: "Sparkles",
      },
    ],
    // Set official Google Play URL here when live on the store
    playStoreUrl: "",
    websiteUrl: "https://fyndralabs.com/products/splitmate",
    supportEmail: "support@fyndralabs.com",
    privacyUrl: "/products/splitmate/privacy",
    termsUrl: "/products/splitmate/terms",
    deleteAccountUrl: "/products/splitmate/delete-account",
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
