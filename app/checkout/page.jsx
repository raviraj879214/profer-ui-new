// app/page.jsx
import CheckoutForm from '../../components/checkout';
import { stripe } from '../../lib/stripe';

export default async function IndexPage() {
  const calculateOrderAmount = (items) => 1800; // Replace with real calculation
  
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: calculateOrderAmount([{ id: 'xl-tshirt' }]),
    currency: 'eur', 
    automatic_payment_methods: { enabled: true },
    description: 'Export of digital service: Profer subscription plan', 
    shipping: {
      name: "John Doe",
      address: {
        line1: "123 Main Street",
        city: "Berlin",
        state: "Berlin",
        postal_code: "10115",
        country: "DE",
      },
    },
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      
        <CheckoutForm clientSecret={clientSecret} />
      
    </main>
  );
}
