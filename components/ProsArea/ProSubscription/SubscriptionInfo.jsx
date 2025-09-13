"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { getStripeActivePlan } from "../../../lib/stripeactiveplan/store";

export function ProSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [daysLeft, setDaysLeft] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [price, setPrice] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        const userid = localStorage.getItem("UserID");
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/subscriptioninfo/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch subscription info");
        const json = await res.json();

        if (json.status === 200 && json.data) {
          setSubscription(json.data);

          const endDate = new Date(json.data.EndDate);
          const today = new Date();
          const diffTime = endDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(diffDays);
        } else {
          setSubscription(null);
          setDaysLeft(null);
        }

        const allSubsRes = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/allsubscriptions/${userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!allSubsRes.ok) throw new Error("Failed to fetch all subscriptions");
        const allSubsJson = await allSubsRes.json();

        if (allSubsJson.status === 200 && Array.isArray(allSubsJson.data)) {
          setSubscriptions(allSubsJson.data);
        } else {
          setSubscriptions([]);
        }
      } catch (error) {
        console.error("API fetch failed", error);
        setSubscription(null);
        setDaysLeft(null);
      }
    }

    fetchSubscriptionData();
  }, []);

  const handlePayNow = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    if (modalOpen) {
      const storedId = localStorage.getItem("UserID");
      if (storedId) setUserId(Number(storedId));
    }
  }, [modalOpen]);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch("/api/stripe-price");
        const data = await res.json();
        setPrice(data);
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    }
    fetchPrice();
  }, []);

  const calculateNewEndDate = () => {
    const today = new Date();
    let newEndDate = new Date(today);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    if (daysLeft && daysLeft > 0) {
      newEndDate.setDate(newEndDate.getDate() + daysLeft);
    }
    return newEndDate;
  };

  const handleRenewSubscription = async () => {
    try {
      const userId = subscription.userId;
      if (!userId) {
        alert("User ID not found");
        return;
      }
      const paymentid = await getStripeActivePlan();
      const res = await fetch("/api/stripe/renew-stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          priceId: paymentid,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">
        Subscription Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Subscription Info */}
        <section className="bg-white p-8 rounded-xl shadow border">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Subscription Info
            </h2>
          </header>

          {subscription ? (
            <>
              <p className="text-base text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">Plan:</span>{" "}
                {subscription.PlanName || "N/A"}
              </p>
              <p className="text-base text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">Start Date:</span>{" "}
                {new Date(subscription.StartDate).toLocaleDateString()}
              </p>
              <p className="text-base text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">End Date:</span>{" "}
                {new Date(subscription.EndDate).toLocaleDateString()}
              </p>
              {daysLeft !== null && (
                <p className="text-base text-gray-700">
                  <span className="font-semibold text-gray-900">Days Left:</span>{" "}
                  {daysLeft} day{daysLeft !== 1 && "s"}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 mb-6">
              No active subscription found.
            </p>
          )}

          {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
            <div className="bg-gray-50 border-l-4 border-gray-400 text-gray-800 p-5 rounded-lg mt-6">
              <p className="text-sm font-semibold">
                Your subscription will expire in <strong>{daysLeft}</strong> day
                {daysLeft !== 1 && "s"}.
              </p>
              <button
                onClick={handlePayNow}
                className="mt-4 w-full py-3 bg-gray-900 text-white rounded-lg  text-sm font-semibold transition"
              >
                Pay Now In Advance
              </button>
            </div>
          )}
        </section>

        {/* Right: Transaction History */}
<section className="bg-white p-6 rounded-xl shadow border">
  <header className="mb-4">
    <h2 className="text-xl font-semibold text-gray-800">
      Transaction History
    </h2>
  </header>

  {subscriptions.length > 0 ? (
    <div className="max-h-80 overflow-y-auto pr-2">
      <ul className="space-y-4">
        {subscriptions.map((txn) => (
          <li
            key={txn.SubscriptionID}
            className="text-sm text-gray-800 border-b pb-3 last:border-b-0"
          >
            <div className="flex justify-between font-medium">
              <span>#{txn.invoiceId}</span>
              <span>
                {txn.Amount
                  ? `$${Number(txn.Amount).toFixed(2)}`
                  : "N/A"}{" "}
                {txn.Currency || ""}
              </span>
            </div>

            <div className="text-gray-500 text-xs mt-1">
              <div>
                {txn.StartDate
                  ? `Start: ${new Date(txn.StartDate).toLocaleDateString()}`
                  : "Start: N/A"}
              </div>
              <div>
                {txn.EndDate
                  ? `End: ${new Date(txn.EndDate).toLocaleDateString()}`
                  : "End: N/A"}
              </div>
              <div>Status: {txn.Status || "N/A"}</div>
            </div>

            {txn.invoiceUrl && (
              <div className="mt-2">
                <a
                  href={txn.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  View Invoice
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p className="text-sm text-gray-500">No transactions available.</p>
  )}
</section>


      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Subscription Renewal"
        ariaHideApp={false}
        className="relative bg-white p-8 rounded-lg max-w-md mx-auto shadow-lg z-50 max-h-[90vh] overflow-auto"
        overlayClassName="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={() => setModalOpen(false)}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Renew Your Subscription
          </h2>

          <p className="text-gray-700 text-lg">
            Thank you for being a valued member of{" "}
            <span className="font-semibold">Profer</span>. To continue enjoying
            uninterrupted access to all premium features and benefits, please
            renew your subscription.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border">
            <p className="text-5xl font-extrabold text-gray-900 tracking-tight">
              ${price ? price.amount : "..."}
              <span className="text-lg font-medium text-gray-600">/year</span>
            </p>
          </div>

          <p className="text-gray-800 text-base">
            If you subscribe now, your subscription will be valid from{" "}
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>{" "}
            until{" "}
            <span className="font-semibold">
              {calculateNewEndDate().toLocaleDateString()}
            </span>
            .
          </p>

          {subscription?.userId && (
            <div className="mt-4">
              <button
                className="bg-[#0C0C2D] hover:bg-[#1E1E3E] text-white w-full py-4 rounded-lg transition text-xl font-semibold shadow-md"
                onClick={() => handleRenewSubscription(subscription.userId)}
              >
                Renew Subscription
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
