"use client";

import { useMemo } from "react";
import {
  type Category,
  type Integration,
  type UserIntegrationConfig,
} from "@/config/integrations";

const statusStyles: Record<string, string> = {
  connected: "bg-green-100 text-green-800 border-green-200",
  disconnected: "bg-amber-100 text-amber-800 border-amber-200",
};

type Props = {
  category: Category;
  integrations: Integration[];
  config: UserIntegrationConfig;
  onSelect: (categoryId: Category["id"], appId: string | null) => void;
  onToggleStatus: (
    categoryId: Category["id"],
    nextStatus: "connected" | "disconnected",
  ) => void;
};

export const IntegrationCard = ({
  category,
  integrations,
  config,
  onSelect,
  onToggleStatus,
}: Props) => {
  const categoryConfig = config[category.id];

  const available = useMemo(
    () => integrations.filter((integration) => integration.status === "available"),
    [integrations],
  );
  const comingSoon = useMemo(
    () => integrations.filter((integration) => integration.status === "coming_soon"),
    [integrations],
  );

  return (
    <div className="card flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category
          </p>
          <h3 className="text-xl font-semibold text-slate-900">{category.label}</h3>
        </div>
        <span
          className={`badge border ${statusStyles[categoryConfig.status]}`}
          aria-label={`Connection status: ${categoryConfig.status}`}
        >
          {categoryConfig.status === "connected" ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Active app</label>
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed"
          value={categoryConfig.activeAppId ?? ""}
          onChange={(event) => onSelect(category.id, event.target.value || null)}
          disabled={!available.length}
        >
          {!available.length && <option value="">No apps available</option>}
          {available.map((integration) => (
            <option key={integration.id} value={integration.id}>
              {integration.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Manage which integration handles this category for your customers.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {available.map((integration) => (
          <span
            key={integration.id}
            className="badge border border-blue-200 bg-blue-50 text-blue-700"
          >
            {integration.name} · {integration.connectType === "oauth" ? "OAuth" : "API"}
          </span>
        ))}
        {comingSoon.map((integration) => (
          <span
            key={integration.id}
            className="badge border border-slate-200 bg-slate-100 text-slate-600"
          >
            {integration.name}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <button
          onClick={() =>
            onToggleStatus(
              category.id,
              categoryConfig.status === "connected"
                ? "disconnected"
                : "connected",
            )
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        >
          {categoryConfig.status === "connected" ? "Disconnect" : "Connect"}
        </button>
        {categoryConfig.activeAppId && (
          <p className="text-xs text-slate-500">
            Routing to: <span className="font-semibold text-slate-700">{available.find((integration) => integration.id === categoryConfig.activeAppId)?.name}</span>
          </p>
        )}
      </div>
    </div>
  );
};
