"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  Key,
  Webhook,
  Upload,
  FileText,
  Code,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/trackverse/navbar";
import { IntegrationList } from "@/components/integrations/integration-card";
import { ManualImportModal } from "@/components/integrations/manual-import-modal";
import { ApiKeyManager } from "@/components/integrations/api-key-manager";
import { WebhookManager } from "@/components/integrations/webhook-manager";
import { Integration, ApiKey, Webhook as WebhookType, WebhookEvent, ApiPermission } from "@/lib/integrations/types";

// Mock data
const mockIntegrations: Integration[] = [
  {
    id: "int_1",
    userId: "u1",
    provider: "strava",
    status: "connected",
    providerUserId: "12345678",
    providerUsername: "runner_elite",
    autoSync: true,
    syncFrequency: "hourly",
    lastSyncAt: "2026-01-06T10:00:00Z",
    lastSyncStatus: "success",
    scopes: ["read", "activity:read_all"],
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2026-01-06T10:00:00Z",
  },
];

const mockApiKeys: ApiKey[] = [
  {
    id: "key_1",
    userId: "u1",
    name: "Production App",
    key: "hashed_key_here",
    keyPrefix: "tv_live_a1b2c3d4",
    permissions: ["read:profile", "read:prs", "read:rankings"],
    rateLimit: 100,
    usageCount: 1234,
    lastUsedAt: "2026-01-06T14:30:00Z",
    createdAt: "2025-11-15T10:00:00Z",
  },
  {
    id: "key_2",
    userId: "u1",
    name: "Development",
    key: "hashed_key_here",
    keyPrefix: "tv_test_e5f6g7h8",
    permissions: ["read:profile", "read:prs", "read:workouts", "read:rankings", "read:meets"],
    rateLimit: 100,
    usageCount: 567,
    lastUsedAt: "2026-01-05T09:00:00Z",
    createdAt: "2025-12-01T10:00:00Z",
  },
];

const mockWebhooks: WebhookType[] = [
  {
    id: "wh_1",
    userId: "u1",
    url: "https://myapp.com/webhooks/trackverse",
    events: ["pr.set", "result.added", "ranking.changed"],
    secret: "whsec_xxx",
    status: "active",
    failureCount: 0,
    lastTriggeredAt: "2026-01-06T12:00:00Z",
    lastResponseCode: 200,
    createdAt: "2025-12-15T10:00:00Z",
    updatedAt: "2026-01-06T12:00:00Z",
  },
];

type Tab = "connections" | "import" | "api" | "webhooks";

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("connections");
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookType[]>(mockWebhooks);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleConnect = (provider: string) => {
    // In real app, redirect to OAuth flow
    console.log("Connect:", provider);
    if (provider === "strava") {
      // window.location.href = getStravaAuthUrl(generateState());
      alert("Would redirect to Strava OAuth...");
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(integrations.filter((i) => i.id !== integrationId));
  };

  const handleSync = async (integrationId: string) => {
    // In real app, trigger sync
    console.log("Sync:", integrationId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleCreateApiKey = async (name: string, permissions: ApiPermission[]) => {
    // In real app, call API
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      userId: "u1",
      name,
      key: "hashed",
      keyPrefix: `tv_live_${Math.random().toString(36).slice(2, 10)}`,
      permissions,
      rateLimit: 100,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    setApiKeys([...apiKeys, newKey]);
    return { key: `tv_live_${Math.random().toString(36).slice(2, 50)}` };
  };

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(apiKeys.map((k) => 
      k.id === keyId ? { ...k, revokedAt: new Date().toISOString() } : k
    ));
  };

  const handleCreateWebhook = async (url: string, events: WebhookEvent[]) => {
    const newWebhook: WebhookType = {
      id: `wh_${Date.now()}`,
      userId: "u1",
      url,
      events,
      secret: `whsec_${Math.random().toString(36).slice(2, 26)}`,
      status: "active",
      failureCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWebhooks([...webhooks, newWebhook]);
    return { secret: newWebhook.secret };
  };

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== webhookId));
  };

  const handleToggleWebhook = (webhookId: string, active: boolean) => {
    setWebhooks(webhooks.map((w) =>
      w.id === webhookId ? { ...w, status: active ? "active" : "paused" } : w
    ));
  };

  const handleTestWebhook = async (webhookId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: Math.random() > 0.2, statusCode: 200 };
  };

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "connections", label: "Connections", icon: <Link2 className="w-4 h-4" /> },
    { id: "import", label: "Import Data", icon: <Upload className="w-4 h-4" /> },
    { id: "api", label: "API Keys", icon: <Key className="w-4 h-4" /> },
    { id: "webhooks", label: "Webhooks", icon: <Webhook className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link2 className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-black text-white">Integrations</h1>
          </div>
          <p className="text-zinc-400">Connect external services and manage API access</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "connections" && (
          <div className="space-y-6">
            <IntegrationList
              integrations={integrations}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onSync={handleSync}
            />
          </div>
        )}

        {activeTab === "import" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Manual Data Import</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Import meet results, PRs, or workout history from CSV or JSON files
                  </p>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Import Data
                  </button>
                </div>
              </div>
            </div>

            {/* Import Tips */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Import Tips</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Download a template to see the expected format</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Times can be in formats like "11.25", "1:45.32", or "4:32:15"</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Dates should be in YYYY-MM-DD or MM/DD/YYYY format</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Field events like long jump can use "6.45m" format</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-6">
            <ApiKeyManager
              apiKeys={apiKeys}
              onCreateKey={handleCreateApiKey}
              onRevokeKey={handleRevokeApiKey}
            />

            {/* API Documentation Link */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Code className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">API Documentation</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Learn how to use the TrackVerse API to build integrations
                  </p>
                  <a
                    href="/docs/api"
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    View Documentation
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "webhooks" && (
          <WebhookManager
            webhooks={webhooks}
            onCreateWebhook={handleCreateWebhook}
            onDeleteWebhook={handleDeleteWebhook}
            onToggleWebhook={handleToggleWebhook}
            onTestWebhook={handleTestWebhook}
          />
        )}

        {/* Import Modal */}
        <ManualImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportComplete={(result) => {
            console.log("Import complete:", result);
            setShowImportModal(false);
          }}
        />
      </main>
    </div>
  );
}
