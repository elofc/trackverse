"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  Unlink,
  RefreshCw,
  Check,
  AlertCircle,
  Clock,
  Settings,
  ExternalLink,
} from "lucide-react";
import { Integration, ProviderConfig, PROVIDER_CONFIGS } from "@/lib/integrations/types";

type IntegrationCardProps = {
  provider: ProviderConfig;
  integration?: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onSettings?: () => void;
};

export function IntegrationCard({
  provider,
  integration,
  onConnect,
  onDisconnect,
  onSync,
  onSettings,
}: IntegrationCardProps) {
  const [syncing, setSyncing] = useState(false);

  const isConnected = integration?.status === "connected";
  const hasError = integration?.status === "error";
  const isSyncing = integration?.status === "syncing" || syncing;

  const handleSync = async () => {
    setSyncing(true);
    await onSync();
    setSyncing(false);
  };

  const getStatusBadge = () => {
    if (!integration) return null;

    switch (integration.status) {
      case "connected":
        return (
          <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/20 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" />
            Connected
          </span>
        );
      case "syncing":
        return (
          <span className="flex items-center gap-1 text-xs text-blue-500 bg-blue-500/20 px-2 py-0.5 rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Syncing
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1 text-xs text-red-500 bg-red-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        );
      default:
        return null;
    }
  };

  const getProviderIcon = () => {
    switch (provider.icon) {
      case "strava":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
        );
      case "garmin":
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm0-19.5C7.029 3 3 7.029 3 12s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z" />
          </svg>
        );
      default:
        return <Link2 className="w-6 h-6" />;
    }
  };

  return (
    <div className={`
      bg-zinc-900 border rounded-xl overflow-hidden transition-colors
      ${isConnected ? "border-green-500/30" : hasError ? "border-red-500/30" : "border-zinc-800"}
    `}>
      {/* Header */}
      <div className="p-4 flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${provider.color}20`, color: provider.color }}
        >
          {getProviderIcon()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white">{provider.name}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-zinc-400 text-sm">{provider.description}</p>

          {/* Connected Account Info */}
          {isConnected && integration?.providerUsername && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-zinc-500">Connected as:</span>
              <span className="text-white">{integration.providerUsername}</span>
            </div>
          )}

          {/* Last Sync */}
          {isConnected && integration?.lastSyncAt && (
            <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
              <Clock className="w-3 h-3" />
              Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
            </div>
          )}

          {/* Error Message */}
          {hasError && integration?.lastSyncError && (
            <div className="mt-2 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
              {integration.lastSyncError}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isConnected && onSettings && (
            <button
              onClick={onSettings}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {provider.features.map((feature) => (
            <span
              key={feature}
              className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-800/30 flex items-center justify-between">
        {!provider.available ? (
          <span className="text-sm text-zinc-500">Coming soon</span>
        ) : isConnected ? (
          <>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 text-white text-sm rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 px-3 py-1.5 text-red-400 text-sm hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Unlink className="w-4 h-4" />
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={onConnect}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
            style={{ backgroundColor: provider.color }}
          >
            <Link2 className="w-4 h-4" />
            Connect {provider.name}
          </button>
        )}
      </div>
    </div>
  );
}

// Integration List
type IntegrationListProps = {
  integrations: Integration[];
  onConnect: (provider: string) => void;
  onDisconnect: (integrationId: string) => void;
  onSync: (integrationId: string) => void;
};

export function IntegrationList({
  integrations,
  onConnect,
  onDisconnect,
  onSync,
}: IntegrationListProps) {
  const integrationMap = new Map(integrations.map((i) => [i.provider, i]));

  return (
    <div className="space-y-4">
      {Object.values(PROVIDER_CONFIGS).map((provider) => (
        <IntegrationCard
          key={provider.provider}
          provider={provider}
          integration={integrationMap.get(provider.provider)}
          onConnect={() => onConnect(provider.provider)}
          onDisconnect={() => {
            const integration = integrationMap.get(provider.provider);
            if (integration) onDisconnect(integration.id);
          }}
          onSync={() => {
            const integration = integrationMap.get(provider.provider);
            if (integration) onSync(integration.id);
          }}
        />
      ))}
    </div>
  );
}
