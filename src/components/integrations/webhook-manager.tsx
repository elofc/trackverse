"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  Plus,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  Check,
  X,
  Copy,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Webhook as WebhookType, WebhookEvent } from "@/lib/integrations/types";

const WEBHOOK_EVENTS: { id: WebhookEvent; label: string; description: string }[] = [
  { id: "workout.created", label: "Workout Created", description: "When a new workout is logged" },
  { id: "workout.updated", label: "Workout Updated", description: "When a workout is modified" },
  { id: "pr.set", label: "PR Set", description: "When a new personal record is achieved" },
  { id: "result.added", label: "Result Added", description: "When a competition result is added" },
  { id: "ranking.changed", label: "Ranking Changed", description: "When ranking position changes" },
];

type WebhookManagerProps = {
  webhooks: WebhookType[];
  onCreateWebhook: (url: string, events: WebhookEvent[]) => Promise<{ secret: string }>;
  onDeleteWebhook: (webhookId: string) => void;
  onToggleWebhook: (webhookId: string, active: boolean) => void;
  onTestWebhook: (webhookId: string) => Promise<{ success: boolean; statusCode?: number }>;
};

export function WebhookManager({
  webhooks,
  onCreateWebhook,
  onDeleteWebhook,
  onToggleWebhook,
  onTestWebhook,
}: WebhookManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<WebhookEvent[]>([]);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean } | null>(null);

  const handleCreateWebhook = async () => {
    if (!newUrl.trim() || newEvents.length === 0) return;

    setCreating(true);
    try {
      const result = await onCreateWebhook(newUrl, newEvents);
      setCreatedSecret(result.secret);
    } catch (error) {
      console.error("Failed to create webhook:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleCopySecret = async () => {
    if (!createdSecret) return;
    await navigator.clipboard.writeText(createdSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewUrl("");
    setNewEvents([]);
    setCreatedSecret(null);
    setCopied(false);
  };

  const handleTestWebhook = async (webhookId: string) => {
    setTestingId(webhookId);
    setTestResult(null);
    try {
      const result = await onTestWebhook(webhookId);
      setTestResult({ id: webhookId, success: result.success });
    } catch (error) {
      setTestResult({ id: webhookId, success: false });
    } finally {
      setTestingId(null);
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const toggleEvent = (event: WebhookEvent) => {
    if (newEvents.includes(event)) {
      setNewEvents(newEvents.filter((e) => e !== event));
    } else {
      setNewEvents([...newEvents, event]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Webhooks</h2>
          <p className="text-zinc-500 text-sm">Receive real-time notifications when events occur</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      {/* Webhooks List */}
      {webhooks.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Webhook className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-2">No Webhooks</h3>
          <p className="text-zinc-500 text-sm mb-4">
            Set up webhooks to receive real-time event notifications
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Your First Webhook
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onDelete={() => onDeleteWebhook(webhook.id)}
              onToggle={(active) => onToggleWebhook(webhook.id, active)}
              onTest={() => handleTestWebhook(webhook.id)}
              isTesting={testingId === webhook.id}
              testResult={testResult?.id === webhook.id ? testResult.success : undefined}
            />
          ))}
        </div>
      )}

      {/* Create Webhook Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {!createdSecret ? (
                <>
                  <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-bold text-white">Create Webhook</h3>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Endpoint URL</label>
                      <input
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://your-server.com/webhook"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Events to Subscribe</label>
                      <div className="space-y-2">
                        {WEBHOOK_EVENTS.map((event) => (
                          <label
                            key={event.id}
                            className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={newEvents.includes(event.id)}
                              onChange={() => toggleEvent(event.id)}
                              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-orange-500 focus:ring-orange-500"
                            />
                            <div>
                              <span className="text-white text-sm">{event.label}</span>
                              <p className="text-zinc-500 text-xs">{event.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-zinc-800 flex gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateWebhook}
                      disabled={!newUrl.trim() || newEvents.length === 0 || creating}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                    >
                      {creating ? "Creating..." : "Create Webhook"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-bold text-white">Webhook Created</h3>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-500 font-medium text-sm">
                            Copy your signing secret now
                          </p>
                          <p className="text-yellow-500/70 text-xs mt-1">
                            Use this secret to verify webhook signatures. It won't be shown again.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Signing Secret</label>
                      <div className="flex gap-2">
                        <code className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-orange-500 font-mono text-sm break-all">
                          {createdSecret}
                        </code>
                        <button
                          onClick={handleCopySecret}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            copied
                              ? "bg-green-500 text-white"
                              : "bg-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-zinc-800">
                    <button
                      onClick={handleCloseModal}
                      className="w-full px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Webhook Card Component
type WebhookCardProps = {
  webhook: WebhookType;
  onDelete: () => void;
  onToggle: (active: boolean) => void;
  onTest: () => void;
  isTesting: boolean;
  testResult?: boolean;
};

function WebhookCard({ webhook, onDelete, onToggle, onTest, isTesting, testResult }: WebhookCardProps) {
  const isActive = webhook.status === "active";
  const hasFailed = webhook.status === "failed";

  return (
    <div className={`
      bg-zinc-900 border rounded-xl p-4
      ${hasFailed ? "border-red-500/30" : isActive ? "border-green-500/30" : "border-zinc-800"}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-sm text-white font-mono truncate">{webhook.url}</code>
            <a
              href={webhook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${isActive ? "bg-green-500/20 text-green-400" :
                hasFailed ? "bg-red-500/20 text-red-400" :
                "bg-zinc-700 text-zinc-400"
              }
            `}>
              {webhook.status}
            </span>
            {webhook.failureCount > 0 && (
              <span className="text-xs text-red-400">
                {webhook.failureCount} failures
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTest}
            disabled={isTesting}
            className={`
              p-2 rounded-lg transition-colors
              ${testResult === true ? "bg-green-500/20 text-green-500" :
                testResult === false ? "bg-red-500/20 text-red-500" :
                "bg-zinc-800 text-zinc-400 hover:text-white"
              }
            `}
          >
            {isTesting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : testResult === true ? (
              <Check className="w-4 h-4" />
            ) : testResult === false ? (
              <X className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onToggle(!isActive)}
            className={`p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Events */}
      <div className="flex flex-wrap gap-1 mb-3">
        {webhook.events.map((event) => (
          <span
            key={event}
            className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded"
          >
            {event}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        {webhook.lastTriggeredAt && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last triggered: {new Date(webhook.lastTriggeredAt).toLocaleString()}
          </span>
        )}
        {webhook.lastResponseCode && (
          <span className={webhook.lastResponseCode >= 200 && webhook.lastResponseCode < 300 ? "text-green-500" : "text-red-500"}>
            HTTP {webhook.lastResponseCode}
          </span>
        )}
      </div>
    </div>
  );
}
