export type CategoryId =
  | "travel"
  | "shopping"
  | "food_delivery"
  | "accommodation"
  | "health";

export type Category = {
  id: CategoryId;
  label: string;
};

export type IntegrationStatus = "available" | "coming_soon";
export type ConnectType = "oauth" | "api_key" | "none";
export type ConnectionStatus = "connected" | "disconnected";

export type Integration = {
  id: string;
  name: string;
  categoryId: CategoryId;
  status: IntegrationStatus;
  connectType: ConnectType;
  logoUrl?: string;
  isDefaultSelected: boolean;
};

export type UserIntegrationConfig = {
  [categoryId in CategoryId]: {
    activeAppId: string | null;
    status: ConnectionStatus;
  };
};

export const categories: Category[] = [
  { id: "travel", label: "Travel" },
  { id: "shopping", label: "Shopping" },
  { id: "food_delivery", label: "Food & Delivery" },
  { id: "accommodation", label: "Accommodation" },
  { id: "health", label: "Health" },
];

export const integrations: Integration[] = [
  {
    id: "booking_travel",
    name: "Booking.com",
    categoryId: "travel",
    status: "available",
    connectType: "oauth",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Booking.com_logo.svg",
    isDefaultSelected: true,
  },
  {
    id: "amazon",
    name: "Amazon",
    categoryId: "shopping",
    status: "available",
    connectType: "oauth",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    isDefaultSelected: true,
  },
  {
    id: "uber_eats",
    name: "Uber Eats",
    categoryId: "food_delivery",
    status: "available",
    connectType: "oauth",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    isDefaultSelected: true,
  },
  {
    id: "booking_accommodation",
    name: "Booking.com",
    categoryId: "accommodation",
    status: "available",
    connectType: "oauth",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Booking.com_logo.svg",
    isDefaultSelected: true,
  },
  {
    id: "health_placeholder",
    name: "Coming soon",
    categoryId: "health",
    status: "coming_soon",
    connectType: "none",
    isDefaultSelected: false,
  },
];

export const CATEGORY_LOOKUP = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;
