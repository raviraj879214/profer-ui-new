export default function CancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">
          Your payment was cancelled. You can try again anytime.
        </p>
        <a
          href="/select-plan"
          className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Back to Pricing
        </a>
      </div>
    </div>
  );
}
