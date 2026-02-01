import { getAuthToken } from "@/lib/utils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const getSubscription = async () => {
  const token = getAuthToken();
  const res = await fetch(`${BACKEND_URL}/subscription`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    return null;
  }
  const text = await res.text();
  if (!text || text.trim() === "") return null;
  return JSON.parse(text);
};

export const createCheckoutSession = async (plan: "pro" | "enterprise") => {
  const token = getAuthToken();
  const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Failed to create checkout session";
    if (text) {
      try {
        const error = JSON.parse(text);
        message = error.error || message;
      } catch {
        message = text;
      }
    }
    throw new Error(message);
  }

  return res.json();
};
