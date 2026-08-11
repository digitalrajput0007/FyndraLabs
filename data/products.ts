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
  description: string;
  logo: string;
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
  status: "Active" | "Beta" | "In Development" | "Planned";
  releaseYear: string;
}

export const products: Product[] = [
  {
    name: "SplitMate",
    slug: "splitmate",
    category: "Finance / Expense Management",
    tagline: "Split expenses, manage shared costs, and track balances effortlessly.",
    description:
      "Split expenses, manage shared costs, and keep track of who owes what — without the usual confusion.",
    logo: "/products/splitmate/logo.svg",
    accentColor: "#0c8ee9",
    screenshots: [
      "/products/splitmate/screenshot-1.png",
      "/products/splitmate/screenshot-2.png",
      "/products/splitmate/screenshot-3.png",
      "/products/splitmate/screenshot-4.png",
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
    playStoreUrl: "",
    websiteUrl: "https://fyndralabs.com/products/splitmate",
    isFeatured: true,
    status: "Active",
    releaseYear: "2026",
  },
  {
    name: "TaskPulse",
    slug: "taskpulse",
    category: "Productivity / Time Management",
    tagline: "Focused daily execution and distraction-free task tracking.",
    description:
      "A distraction-free task & time tracking app built to help individuals prioritize high-impact daily goals without workflow clutter.",
    logo: "/products/taskpulse/logo.svg",
    accentColor: "#10b981",
    screenshots: [],
    features: [
      {
        title: "Focus Timers",
        description: "Integrated Pomodoro & custom deep-work intervals.",
        icon: "Zap",
      },
      {
        title: "Priority Matrix",
        description: "Auto-sort tasks by urgency and importance.",
        icon: "FolderKanban",
      },
      {
        title: "Daily Reflections",
        description: "Quick 60-second end-of-day accomplishment logs.",
        icon: "Sparkles",
      },
    ],
    whyItExists: {
      problem: "Traditional task managers are bloated with complex kanban boards and unnecessary configuration.",
      solution: "TaskPulse cuts out noise and keeps your attention strictly on completing today's 3 key priorities.",
    },
    howItWorks: [
      { step: 1, title: "List Daily 3", description: "Choose 3 high-impact tasks for today." },
      { step: 2, title: "Start Timer", description: "Focus with zero notifications during intervals." },
      { step: 3, title: "Track Progress", description: "Review daily streak metrics." },
    ],
    playStoreUrl: "",
    isFeatured: false,
    status: "In Development",
    releaseYear: "2026",
  },
  {
    name: "HabitFlow",
    slug: "habitflow",
    category: "Health & Lifestyle",
    tagline: "Build sustainable habits with minimalist streak tracking.",
    description:
      "A simple, beautiful habit tracker designed around momentum, micro-steps, and positive reinforcement.",
    logo: "/products/habitflow/logo.svg",
    accentColor: "#8b5cf6",
    screenshots: [],
    features: [
      {
        title: "Visual Streaks",
        description: "Track progress with clean, satisfying heatmaps.",
        icon: "Sparkles",
      },
      {
        title: "Smart Reminders",
        description: "Contextual prompts that fit your daily routine.",
        icon: "Zap",
      },
    ],
    whyItExists: {
      problem: "Habit apps often overwhelm users with rigid point systems and punishment mechanics.",
      solution: "HabitFlow focuses on frictionless consistency and flexible streak recovery.",
    },
    howItWorks: [
      { step: 1, title: "Define Habit", description: "Pick a simple daily habit." },
      { step: 2, title: "Check Off", description: "Tap to record daily completion." },
    ],
    playStoreUrl: "",
    isFeatured: false,
    status: "Planned",
    releaseYear: "2026",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}
