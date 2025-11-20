"use client";

import { IntegrationCard } from "./components/IntegrationCard";
import { RouterPlayground } from "./components/RouterPlayground";
import { useIntegrationConfig } from "./hooks/useIntegrationConfig";
import { categories, integrations } from "@/config/integrations";

export default function Home() {
  const {
    config,
    isReady,
    setActiveApp,
    setConnectionStatus,
    resetConfig,
  } = useIntegrationConfig();

  if (!isReady || !config) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-center text-sm text-slate-500">Loading your workspace...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Customer Integration Portal
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Configure apps and test the routing agent
          </h1>
          <p className="max-w-3xl text-sm text-slate-600">
            Map categories to apps your customers use, then try sending a user request through the agentic
            router to verify the end-to-end experience.
          </p>
        </div>
        <button
          onClick={resetConfig}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          Reset to defaults
        </button>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Phase 1 – UI Config Layer</h2>
            <span className="badge border border-emerald-200 bg-emerald-50 text-emerald-700">
              Active per category
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <IntegrationCard
                key={category.id}
                category={category}
                config={config}
                integrations={integrations.filter((integration) => integration.categoryId === category.id)}
                onSelect={setActiveApp}
                onToggleStatus={setConnectionStatus}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <RouterPlayground config={config} />
        </div>
      </section>
    </main>
  );
}
