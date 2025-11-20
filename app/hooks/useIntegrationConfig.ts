"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  categories,
  integrations,
  type CategoryId,
  type UserIntegrationConfig,
  type ConnectionStatus,
} from "@/config/integrations";

const STORAGE_KEY = "user-integration-config";

const buildDefaultConfig = (): UserIntegrationConfig => {
  return categories.reduce((acc, category) => {
    const defaultIntegration = integrations.find(
      (integration) =>
        integration.categoryId === category.id &&
        integration.status === "available" &&
        integration.isDefaultSelected,
    );

    acc[category.id] = {
      activeAppId: defaultIntegration?.id ?? null,
      status: defaultIntegration ? "connected" : "disconnected",
    };

    return acc;
  }, {} as UserIntegrationConfig);
};

export const useIntegrationConfig = () => {
  const [config, setConfig] = useState<UserIntegrationConfig | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
        return;
      } catch (err) {
        console.warn("Failed to parse integration config", err);
      }
    }
    setConfig(buildDefaultConfig());
  }, []);

  const persist = useCallback((next: UserIntegrationConfig) => {
    setConfig(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const setActiveApp = useCallback(
    (categoryId: CategoryId, appId: string | null) => {
      if (!config) return;
      const next: UserIntegrationConfig = {
        ...config,
        [categoryId]: {
          ...config[categoryId],
          activeAppId: appId,
          status: appId ? "connected" : "disconnected",
        },
      };
      persist(next);
    },
    [config, persist],
  );

  const setConnectionStatus = useCallback(
    (categoryId: CategoryId, status: ConnectionStatus) => {
      if (!config) return;
      const fallbackApp = integrations.find(
        (integration) => integration.categoryId === categoryId,
      );
      const next: UserIntegrationConfig = {
        ...config,
        [categoryId]: {
          ...config[categoryId],
          status,
          activeAppId:
            status === "connected"
              ? config[categoryId].activeAppId ?? fallbackApp?.id ?? null
              : null,
        },
      };
      persist(next);
    },
    [config, persist],
  );

  const resetConfig = useCallback(() => {
    const defaults = buildDefaultConfig();
    persist(defaults);
  }, [persist]);

  const availableCategories = useMemo(() => categories, []);

  return {
    config,
    isReady: Boolean(config),
    availableCategories,
    setActiveApp,
    setConnectionStatus,
    resetConfig,
  } as const;
};
