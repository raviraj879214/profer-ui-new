// app/success/page.jsx
import { stripe } from "../../lib/stripe";
import { redirect } from "next/navigation";

export default async function SuccessPage({ searchParams }) {
  const { payment_intent: paymentIntentId } = searchParams;
  //Changed by 123456789
  if (!paymentIntentId) redirect("/");

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!paymentIntent) redirect("/");

  return (
    <div>
      <h2>Payment {paymentIntent.status}</h2>
      <p>Payment ID: {paymentIntent.id}</p>
    </div>
  );
}
