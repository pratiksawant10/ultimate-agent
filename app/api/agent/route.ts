import { NextResponse } from "next/server";
import {
  categories,
  integrations,
  type CategoryId,
  type UserIntegrationConfig,
} from "@/config/integrations";

const detectCategory = (message: string): CategoryId | null => {
  const lowered = message.toLowerCase();
  if (/flight|plane|travel|trip/.test(lowered)) return "travel";
  if (/hotel|stay|room/.test(lowered)) return "accommodation";
  if (/shop|buy|order/.test(lowered)) return "shopping";
  if (/food|meal|deliver|lunch|dinner/.test(lowered)) return "food_delivery";
  if (/doctor|clinic|health|medicine/.test(lowered)) return "health";
  return null;
};

const buildSummary = (categoryId: CategoryId | null, appName: string | null) => {
  if (!categoryId) return "No category detected from message. Showing latest selection.";
  const categoryLabel = categories.find((category) => category.id === categoryId)?.label;
  return `Routed to ${categoryLabel ?? categoryId} using ${appName ?? "no active app"}.`;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { message, preferredCategoryId, userConfig } = body as {
    message?: string;
    preferredCategoryId?: CategoryId | null;
    userConfig?: UserIntegrationConfig;
  };

  const categoryId = preferredCategoryId ?? detectCategory(message ?? "");
  const activeAppId = categoryId ? userConfig?.[categoryId]?.activeAppId ?? null : null;
  const routedIntegration = activeAppId
    ? integrations.find((integration) => integration.id === activeAppId)
    : null;

  return NextResponse.json({
    categoryId,
    routedAppName: routedIntegration?.name ?? null,
    message,
    summary: buildSummary(categoryId, routedIntegration?.name ?? null),
  });
}
