import { useState } from "react";

export function BidModal({ bidlist, isOpen, setIsOpen }) {
  // Track expanded bids by id in a Set or an array
  const [expandedBids, setExpandedBids] = useState(new Set());

  function toggleExpand(bidId) {
    setExpandedBids(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bidId)) {
        newSet.delete(bidId);
      } else {
        newSet.add(bidId);
      }
      return newSet;
    });
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative p-4 w-full max-w-2xl max-h-full overflow-auto">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bid by companies
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 md:p-5 space-y-4">
                {bidlist.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Company</th>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Bid Amount</th>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Message</th>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Contact</th>
                          <th className="py-3 px-4 text-left text-gray-700 font-medium">Logs</th> {/* New column for button */}
                        </tr>
                      </thead>
                      <tbody>
                        {bidlist.map((bid) => (
                          <React.Fragment key={bid.id}>
                            <tr className="even:bg-gray-50 odd:bg-white hover:bg-gray-100">
                              <td className="py-3 px-4 flex items-center gap-2">
                                <img
                                  src={bid.companyDetails.companyLogo}
                                  alt={bid.companyDetails.companyName}
                                  className="w-8 h-8 rounded-full border"
                                />
                                <span>{bid.companyDetails.companyName}</span>
                              </td>
                              <td className="py-3 px-4">${bid.amount}</td>
                              <td className="py-3 px-4">{bid.message}</td>
                              <td className="py-3 px-4 text-blue-600">{bid.companyDetails.companyEmail}</td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => toggleExpand(bid.id)}
                                  className="text-xl font-bold rounded-full w-7 h-7 flex items-center justify-center border border-gray-400 hover:bg-gray-200"
                                  aria-label={expandedBids.has(bid.id) ? "Collapse logs" : "Expand logs"}
                                >
                                  {expandedBids.has(bid.id) ? "−" : "+"}
                                </button>
                              </td>
                            </tr>

                            {/* Expanded logs row */}
                            {expandedBids.has(bid.id) && (
                              <tr className="bg-gray-100">
                                <td colSpan={5} className="p-4 text-sm text-gray-700">
                                  {/* Example logs content here */}
                                  <strong>Logs for {bid.companyDetails.companyName}:</strong>
                                  <ul className="list-disc list-inside mt-2">
                                    <li>Log entry 1 related to bid #{bid.id}</li>
                                    <li>Log entry 2 related to bid #{bid.id}</li>
                                    <li>More details or history can go here...</li>
                                  </ul>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Waiting for bids...
                  </div>
                )}
              </div>

              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
