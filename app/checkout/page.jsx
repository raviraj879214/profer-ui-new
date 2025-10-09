// app/page.jsx
export const dynamic = 'force-dynamic';


import CheckoutForm from '../../components/checkout';


export default async function IndexPage() {



  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      
        <CheckoutForm  />
      
    </main>
  );
}
