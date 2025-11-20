"use client";

import { useMemo, useState } from "react";
import {
  categories,
  integrations,
  type CategoryId,
  type UserIntegrationConfig,
} from "@/config/integrations";

const detectCategoryFromMessage = (message: string): CategoryId | null => {
  const lowered = message.toLowerCase();
  if (/flight|plane|travel|trip/.test(lowered)) return "travel";
  if (/hotel|stay|room/.test(lowered)) return "accommodation";
  if (/shop|buy|order/.test(lowered)) return "shopping";
  if (/food|meal|deliver|lunch|dinner/.test(lowered)) return "food_delivery";
  if (/doctor|clinic|health|medicine/.test(lowered)) return "health";
  return null;
};

const mockReason = (category: CategoryId | null) => {
  if (!category) return "No category detected. Using manual selection.";
  const categoryLabel = categories.find((cat) => cat.id === category)?.label ?? category;
  return `Detected intent for ${categoryLabel} based on keywords.`;
};

type PlaygroundResponse = {
  routedCategory: CategoryId | null;
  appName: string | null;
  message: string;
  summary: string;
};

type Props = {
  config: UserIntegrationConfig;
};

export const RouterPlayground = ({ config }: Props) => {
  const [message, setMessage] = useState("Book me a flight and hotel in Lisbon next month");
  const [selectedCategory, setSelectedCategory] = useState<"auto" | CategoryId>("auto");
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = useMemo(
    () => [{ id: "auto", label: "Auto-detect" as const }, ...categories],
    [],
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    const routedCategory =
      selectedCategory === "auto" ? detectCategoryFromMessage(message) : selectedCategory;
    const activeAppId = routedCategory ? config[routedCategory]?.activeAppId ?? null : null;
    const activeIntegration = activeAppId
      ? integrations.find((integration) => integration.id === activeAppId)
      : null;

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          preferredCategoryId: selectedCategory === "auto" ? null : selectedCategory,
          userConfig: config,
        }),
      });
      const data = await res.json();
      setResponse({
        routedCategory: data.categoryId ?? routedCategory,
        appName: data.routedAppName ?? activeIntegration?.name ?? null,
        message,
        summary: data.summary ?? mockReason(routedCategory),
      });
    } catch (error) {
      setResponse({
        routedCategory,
        appName: activeIntegration?.name ?? null,
        message,
        summary: "Request failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-full p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Phase 2 – Agent Playground
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            Route a user request to the right agent
          </h3>
        </div>
        <span className="badge border border-indigo-200 bg-indigo-50 text-indigo-700">
          Agent simulation
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="user-message">
          User message
        </label>
        <textarea
          id="user-message"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask for a flight, shopping item, meal, or anything else..."
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Routing category</label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value as CategoryId | "auto")}
          >
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">
            Choose a category or let the agent auto-detect intent from the user message.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Active app snapshot</label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {selectedCategory === "auto"
              ? "Auto-detect uses the selected app per category."
              : config[selectedCategory]?.activeAppId
                ? integrations.find((integration) =>
                    integration.id === config[selectedCategory]?.activeAppId,
                  )?.name
                : "No active app set for this category."}
          </div>
        </div>
      </div>

      <button
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        onClick={handleSubmit}
        disabled={isLoading || !message.trim()}
      >
        {isLoading ? "Routing..." : "Send to routing agent"}
      </button>

      {response && (
        <div className="mt-5 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge border border-green-200 bg-green-50 text-green-700">
              Routed: {response.routedCategory ?? "none"}
            </span>
            <span className="badge border border-blue-200 bg-blue-50 text-blue-700">
              App: {response.appName ?? "No active app"}
            </span>
          </div>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">User message:</span> {response.message}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Reasoning:</span> {response.summary || mockReason(response.routedCategory)}
          </p>
          <p className="text-xs text-slate-500">
            This is a mock response showing how a routing agent could behave.
          </p>
        </div>
      )}
    </div>
  );
};
