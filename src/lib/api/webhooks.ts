// Webhook System

import { Webhook, WebhookEvent, WebhookDelivery } from "../integrations/types";
import crypto from "crypto";

// Generate webhook signature
export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Generate webhook secret
export function generateWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(24).toString("hex")}`;
}

// Webhook delivery queue (in production, use a proper queue like Bull/BullMQ)
const deliveryQueue: WebhookDelivery[] = [];

// Queue a webhook delivery
export function queueWebhookDelivery(
  webhook: Webhook,
  event: WebhookEvent,
  payload: Record<string, unknown>
): WebhookDelivery {
  const delivery: WebhookDelivery = {
    id: `whd_${crypto.randomBytes(12).toString("hex")}`,
    webhookId: webhook.id,
    event,
    payload,
    status: "pending",
    attempts: 0,
    createdAt: new Date().toISOString(),
  };

  deliveryQueue.push(delivery);
  return delivery;
}

// Process webhook delivery
export async function processWebhookDelivery(
  delivery: WebhookDelivery,
  webhook: Webhook
): Promise<WebhookDelivery> {
  const payload = JSON.stringify({
    id: delivery.id,
    event: delivery.event,
    data: delivery.payload,
    createdAt: delivery.createdAt,
  });

  const signature = generateWebhookSignature(payload, webhook.secret);

  const startTime = Date.now();

  try {
    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TrackVerse-Signature": signature,
        "X-TrackVerse-Event": delivery.event,
        "X-TrackVerse-Delivery": delivery.id,
      },
      body: payload,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.text().catch(() => "");

    delivery.responseCode = response.status;
    delivery.responseBody = responseBody.slice(0, 1000); // Limit stored response
    delivery.duration = duration;
    delivery.attempts++;

    if (response.ok) {
      delivery.status = "success";
    } else {
      delivery.status = "failed";
      // Schedule retry for non-2xx responses
      if (delivery.attempts < 3) {
        delivery.nextRetryAt = new Date(
          Date.now() + Math.pow(2, delivery.attempts) * 60000 // Exponential backoff
        ).toISOString();
      }
    }
  } catch (error) {
    delivery.duration = Date.now() - startTime;
    delivery.attempts++;
    delivery.status = "failed";
    delivery.responseBody = error instanceof Error ? error.message : "Unknown error";

    // Schedule retry
    if (delivery.attempts < 3) {
      delivery.nextRetryAt = new Date(
        Date.now() + Math.pow(2, delivery.attempts) * 60000
      ).toISOString();
    }
  }

  return delivery;
}

// Trigger webhooks for an event
export async function triggerWebhooks(
  webhooks: Webhook[],
  event: WebhookEvent,
  payload: Record<string, unknown>
): Promise<void> {
  const activeWebhooks = webhooks.filter(
    (w) => w.status === "active" && w.events.includes(event)
  );

  for (const webhook of activeWebhooks) {
    const delivery = queueWebhookDelivery(webhook, event, payload);
    
    // Process immediately (in production, use background job)
    processWebhookDelivery(delivery, webhook).catch(console.error);
  }
}

// Event payload builders
export function buildWorkoutCreatedPayload(workout: {
  id: string;
  userId: string;
  name: string;
  type: string;
  date: string;
  duration: number;
  distance?: number;
}): Record<string, unknown> {
  return {
    type: "workout.created",
    workout: {
      id: workout.id,
      userId: workout.userId,
      name: workout.name,
      type: workout.type,
      date: workout.date,
      duration: workout.duration,
      distance: workout.distance,
    },
  };
}

export function buildPRSetPayload(pr: {
  userId: string;
  event: string;
  time: number;
  previousTime?: number;
  date: string;
  meetName?: string;
}): Record<string, unknown> {
  return {
    type: "pr.set",
    pr: {
      userId: pr.userId,
      event: pr.event,
      time: pr.time,
      previousTime: pr.previousTime,
      improvement: pr.previousTime ? pr.previousTime - pr.time : undefined,
      date: pr.date,
      meetName: pr.meetName,
    },
  };
}

export function buildResultAddedPayload(result: {
  userId: string;
  event: string;
  time: number;
  place?: number;
  meetName: string;
  meetDate: string;
  isPR: boolean;
}): Record<string, unknown> {
  return {
    type: "result.added",
    result: {
      userId: result.userId,
      event: result.event,
      time: result.time,
      place: result.place,
      meetName: result.meetName,
      meetDate: result.meetDate,
      isPR: result.isPR,
    },
  };
}

export function buildRankingChangedPayload(ranking: {
  userId: string;
  event: string;
  previousRank?: number;
  newRank: number;
  scope: "state" | "national";
  state?: string;
}): Record<string, unknown> {
  return {
    type: "ranking.changed",
    ranking: {
      userId: ranking.userId,
      event: ranking.event,
      previousRank: ranking.previousRank,
      newRank: ranking.newRank,
      change: ranking.previousRank ? ranking.previousRank - ranking.newRank : undefined,
      scope: ranking.scope,
      state: ranking.state,
    },
  };
}

// Test webhook endpoint
export async function testWebhook(webhook: Webhook): Promise<{
  success: boolean;
  statusCode?: number;
  duration?: number;
  error?: string;
}> {
  const testPayload = {
    type: "test",
    message: "This is a test webhook from TrackVerse",
    timestamp: new Date().toISOString(),
  };

  const payload = JSON.stringify(testPayload);
  const signature = generateWebhookSignature(payload, webhook.secret);

  const startTime = Date.now();

  try {
    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TrackVerse-Signature": signature,
        "X-TrackVerse-Event": "test",
        "X-TrackVerse-Delivery": `test_${Date.now()}`,
      },
      body: payload,
      signal: AbortSignal.timeout(10000),
    });

    return {
      success: response.ok,
      statusCode: response.status,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
