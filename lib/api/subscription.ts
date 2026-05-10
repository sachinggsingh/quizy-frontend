const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";

export const getSubscription = async () => {
  const res = await fetch(`${BACKEND_URL}/subscription`, {
    credentials: 'include', // Include cookies for authentication
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    return null;
  }
  const text = await res.text();
  if (!text || text.trim() === "") return null;
  try {
    const parsed = JSON.parse(text);
    // API responses are wrapped as { data, success }, so unwrap if present
    if (parsed && typeof parsed === "object" && "data" in parsed) {
      return (parsed as { data?: unknown }).data ?? null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const createCheckoutSession = async (plan: "pro" | "enterprise", priceId?: string) => {
  const res = await fetch(`${BACKEND_URL}/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify({ plan, price_id: priceId }),
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
