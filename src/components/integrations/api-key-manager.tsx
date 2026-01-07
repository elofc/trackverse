"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react";
import { ApiKey, ApiPermission } from "@/lib/integrations/types";
import {
  ALL_PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
  DEFAULT_PERMISSIONS,
  maskApiKey,
} from "@/lib/api/keys";

type ApiKeyManagerProps = {
  apiKeys: ApiKey[];
  onCreateKey: (name: string, permissions: ApiPermission[]) => Promise<{ key: string }>;
  onRevokeKey: (keyId: string) => void;
};

export function ApiKeyManager({ apiKeys, onCreateKey, onRevokeKey }: ApiKeyManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<ApiPermission[]>(DEFAULT_PERMISSIONS);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      const result = await onCreateKey(newKeyName, newKeyPermissions);
      setCreatedKey(result.key);
    } catch (error) {
      console.error("Failed to create API key:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleCopyKey = async () => {
    if (!createdKey) return;
    await navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewKeyName("");
    setNewKeyPermissions(DEFAULT_PERMISSIONS);
    setCreatedKey(null);
    setCopied(false);
  };

  const togglePermission = (permission: ApiPermission) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(newKeyPermissions.filter((p) => p !== permission));
    } else {
      setNewKeyPermissions([...newKeyPermissions, permission]);
    }
  };

  const activeKeys = apiKeys.filter((k) => !k.revokedAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">API Keys</h2>
          <p className="text-zinc-500 text-sm">Manage your API keys for programmatic access</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      {/* Keys List */}
      {activeKeys.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Key className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-2">No API Keys</h3>
          <p className="text-zinc-500 text-sm mb-4">
            Create an API key to access TrackVerse data programmatically
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Your First Key
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeKeys.map((apiKey) => (
            <ApiKeyCard
              key={apiKey.id}
              apiKey={apiKey}
              onRevoke={() => setKeyToRevoke(apiKey.id)}
            />
          ))}
        </div>
      )}

      {/* Create Key Modal */}
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
              {!createdKey ? (
                <>
                  <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-bold text-white">Create API Key</h3>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Key Name</label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., Production App"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Permissions</label>
                      <div className="space-y-2">
                        {ALL_PERMISSIONS.map((permission) => (
                          <label
                            key={permission}
                            className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={newKeyPermissions.includes(permission)}
                              onChange={() => togglePermission(permission)}
                              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-orange-500 focus:ring-orange-500"
                            />
                            <div>
                              <span className="text-white text-sm">{permission}</span>
                              <p className="text-zinc-500 text-xs">
                                {PERMISSION_DESCRIPTIONS[permission]}
                              </p>
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
                      onClick={handleCreateKey}
                      disabled={!newKeyName.trim() || creating}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                    >
                      {creating ? "Creating..." : "Create Key"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-bold text-white">API Key Created</h3>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-500 font-medium text-sm">
                            Copy your API key now
                          </p>
                          <p className="text-yellow-500/70 text-xs mt-1">
                            This is the only time you'll see this key. Store it securely.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Your API Key</label>
                      <div className="flex gap-2">
                        <code className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-orange-500 font-mono text-sm break-all">
                          {createdKey}
                        </code>
                        <button
                          onClick={handleCopyKey}
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

      {/* Revoke Confirmation Modal */}
      <AnimatePresence>
        {keyToRevoke && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setKeyToRevoke(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-bold text-white mb-2">Revoke API Key?</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  This action cannot be undone. Any applications using this key will stop working.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setKeyToRevoke(null)}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onRevokeKey(keyToRevoke);
                      setKeyToRevoke(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Revoke Key
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// API Key Card Component
type ApiKeyCardProps = {
  apiKey: ApiKey;
  onRevoke: () => void;
};

function ApiKeyCard({ apiKey, onRevoke }: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);

  const isExpired = apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();

  return (
    <div className={`
      bg-zinc-900 border rounded-xl p-4
      ${isExpired ? "border-red-500/30" : "border-zinc-800"}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">{apiKey.name}</h3>
            {isExpired && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                Expired
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-sm text-zinc-500 font-mono">
              {showKey ? apiKey.keyPrefix + "..." : maskApiKey(apiKey.keyPrefix + "xxxx")}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              {showKey ? (
                <EyeOff className="w-3 h-3 text-zinc-500" />
              ) : (
                <Eye className="w-3 h-3 text-zinc-500" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onRevoke}
          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Permissions */}
      <div className="flex flex-wrap gap-1 mb-3">
        {apiKey.permissions.map((permission) => (
          <span
            key={permission}
            className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded"
          >
            {permission}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          {apiKey.usageCount.toLocaleString()} requests
        </span>
        {apiKey.lastUsedAt && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last used: {new Date(apiKey.lastUsedAt).toLocaleDateString()}
          </span>
        )}
        <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
