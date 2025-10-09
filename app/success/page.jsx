// export const dynamic = 'force-dynamic';
// // app/success/page.jsx

// import { stripe } from "../../lib/stripe";
// import { redirect } from "next/navigation";


// export default async function SuccessPage({ searchParams }) {

//   const { payment_intent: paymentIntentId } = searchParams;


//   if (!paymentIntentId) redirect("/");

//   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//   if (!paymentIntent) redirect("/");



//   return (
//     <div>
//       <h2>Payment {paymentIntent.status}</h2>
//       <p>Payment ID: {paymentIntent.id}</p>
//     </div>
//   );


// }


export default function SuccessPage(){


  
  return(<>
  
  </>);
}