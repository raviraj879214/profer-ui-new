// lib/stripe.js

export const getStripeActivePlan = async () => {
  debugger;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-active-plan`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("⚠️ Failed to fetch active Stripe plan, response not OK");
      throw new Error("Failed to fetch active Stripe plan");
    }

    const result = await res.json();

    if (result.status === 200 && result.data) {
      return result.data.priceId;
    }

    return null;
  } catch (err) {
    console.log("⚠️ Error fetching active plan:", err.message);
    return null;
  }
};
