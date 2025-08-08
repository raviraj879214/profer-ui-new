'use client';
import { useEffect, useState } from 'react';

export function Subscriptions() {
  //  const sessionId = "cs_test_a1IBbHZuQaUSCLgbSZibrnFBsEwwmRgO0SqJ3opCGU6ePhswzgJEAGIkk1";

  const [sessionId,setsessionId] = useState("cs_test_a1IBbHZuQaUSCLgbSZibrnFBsEwwmRgO0SqJ3opCGU6ePhswzgJEAGIkk1");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [cancelNow, setCancelNow] = useState(false);

  const formatDate = (timestamp) =>
    timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : 'Not available';

  const handleAction = async (type) => {
    if (!data?.subscription?.id) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/subscription/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: data.subscription.id,
          immediate: cancelNow,
        }),
      });
      if (!res.ok) throw new Error(`Failed to ${type}`);
      window.location.reload();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  const fetchpaymentid = async () => {
  try {
    const userid = localStorage.getItem("UserID");
    if (!userid) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-pro-details/${userid}`);
    if (!res.ok) throw new Error("Failed to fetch subscription");

    const result = await res.json();
    if (result.status === 200 && result.data?.length > 0) {
      console.log("result", result);
      const subscriptionId = result.data[0]?.StripeSubscriptionID;
      if (subscriptionId) {
       
        setsessionId(subscriptionId);
      }
    } else {
      console.warn("No subscription found");
    }
  } catch (error) {
    console.error("Error fetching subscription ID:", error);
  }
};

// useEffect(() => {
//   const init = async () => {
//     await fetchpaymentid(); // First get the session ID
//   };
//   init();
// }, []);



    
  useEffect(() => {
    

    const fetchData = async () => {
      await fetchpaymentid();
      console.log("sessionId",sessionId);
      try {
        const res = await fetch(`/api/session?session_id=${sessionId}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching session data:', err);
        setError('Failed to load session info.');
      }
    };

    fetchData();
  }, [sessionId]);

  if (error) {
    return <div className="text-red-600 text-center mt-20 text-lg">{error}</div>;
  }

  if (!data) {
    return <div className="text-gray-600 text-center mt-20 text-lg">Loading session...</div>;
  }

  const { isSubscription, session, subscription, planName } = data;

  return (
    <div className="max-w-6xl mx-auto mt-16 px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Payment Details</h1>

      {isSubscription ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Details */}
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-green-700">Plan Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><span className="font-medium text-gray-600">Plan:</span> {planName}</p>
              <p><span className="font-medium text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-white text-xs ${subscription.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {subscription.status}
                </span>
              </p>
              <p><span className="font-medium text-gray-600">Renews On:</span> {formatDate(subscription.current_period_end)}</p>
              {subscription.trial_end && (
                <p><span className="font-medium text-gray-600">Trial Ends:</span> {formatDate(subscription.trial_end)}</p>
              )}
              <p><span className="font-medium text-gray-600">Cancel at Period End:</span> {subscription.cancel_at_period_end ? 'Yes' : 'No'}</p>
              {subscription.pause_collection?.behavior && (
                <p><span className="font-medium text-yellow-700">Paused:</span> {subscription.pause_collection.behavior}</p>
              )}
            </div>
          </div>

          {/* Manage Subscription */}
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Manage Subscription</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleAction('pause')}
                  disabled={loadingAction}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded transition disabled:opacity-50"
                >
                  Pause
                </button>

                {subscription.pause_collection?.behavior && (
                  <button
                    onClick={() => handleAction('resume')}
                    disabled={loadingAction}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition disabled:opacity-50"
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={cancelNow}
                  onChange={(e) => setCancelNow(e.target.checked)}
                  className="accent-red-500"
                />
                Cancel Immediately
              </label>
              <button
                onClick={() => handleAction('cancel')}
                disabled={loadingAction}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded transition disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      ) : (
        // One-time payment
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">One-Time Payment</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><span className="font-medium text-gray-600">Amount:</span> ₹{(session.amount_total / 100).toFixed(2)}</p>
            <p><span className="font-medium text-gray-600">Status:</span> {session.payment_status}</p>
            <p><span className="font-medium text-gray-600">Customer Email:</span> {session.customer_details?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
