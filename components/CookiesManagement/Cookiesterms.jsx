"use client";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowBanner(true); // Show banner if no consent stored
  }, []);

  const handleConsent = (value) => {
    localStorage.setItem("cookieConsent", value);
    setShowBanner(false);
    setShowPreferences(false);

    if (value === "accepted") {
      console.log("User accepted cookies");
      // Load optional scripts here
    } else {
      console.log("Only necessary cookies allowed");
    }
  };

  if (!showBanner && !showPreferences) return null;

  return (
    <section className="fixed bottom-0 left-0 w-full bg-gray-50 dark:bg-gray-800 shadow-lg z-50">
      {!showPreferences ? (
        <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base flex-1">
            By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.
          </p>

          <div className="flex items-center gap-x-4 lg:gap-x-8 flex-wrap mt-4 lg:mt-0">
            <button
              onClick={() => setShowPreferences(true)}
              className="w-1/2 md:w-auto text-sm text-gray-800 underline hover:text-gray-600 dark:text-white dark:hover:text-gray-400 transition-colors px-3 py-2 rounded"
            >
              Cookie Settings
            </button>

            <button
              onClick={() => handleConsent("accepted")}
              className="w-1/2 md:w-auto text-sm font-medium bg-gray-900 hover:bg-gray-900/80 text-white px-4 py-2.5 rounded-lg transition-colors"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-3 flex-1">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              Cookie Preferences
            </p>

            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked disabled className="accent-blue-600" />
              Necessary Cookies (always active)
            </label>

            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={localStorage.getItem("cookieConsent") === "accepted"}
                onChange={(e) =>
                  e.target.checked
                    ? handleConsent("accepted")
                    : handleConsent("rejected")
                }
                className="accent-blue-600"
              />
              Optional Cookies (analytics, marketing)
            </label>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowPreferences(false)}
              className="px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
