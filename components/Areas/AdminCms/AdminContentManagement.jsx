"use client";
import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";

export function AdminCms() {
    const [text, setText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Fetch CMS categories from backend
    const fetchCmsCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage({ text: "Authentication token missing. Please login.", type: "error" });
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-cms-pages`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();
            if (res.ok && result.status === 200) {
                const options = result.cms.map((page) => ({
                    label: page.CmsPageName,
                    value: page.CmsID,
                    CmsText: page.CmsText,
                }));
                setCategories(options);
            } else {
                setMessage({ text: "Failed to fetch categories: " + result.message, type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Error fetching CMS categories: " + error.message, type: "error" });
        }
    };

    // Save content
    const handleSave = async () => {
        try {
            setLoading(true);
            if (!selectedCategory) {
                setMessage({ text: "Please select a page.", type: "error" });
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                setMessage({ text: "No token found. Please log in again.", type: "error" });
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/update-cms-page`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    CmsID: selectedCategory,
                    CmsText: text,
                }),
            });

            const result = await res.json();
            if (res.ok && result.status === 200) {
                setMessage({ text: "Content saved successfully!", type: "success" });

                // ✅ Reload categories
                await fetchCmsCategories();

                // ✅ Reset dropdown + editor
                setSelectedCategory(null);
                setText("");
            } else {
                setMessage({ text: "Failed to save: " + result.message, type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Error saving content: " + error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const onChangeCategory = (data) => {
        setSelectedCategory(data);
        const selectedPage = categories.find((x) => x.value === data);
        if (selectedPage) {
            setText(selectedPage.CmsText);
        } else {
            setText("");
        }
    };

    // Run only once on mount
    useEffect(() => {
        fetchCmsCategories();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Content Editor
                    </h2>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`mt-3 md:mt-0 px-5 py-2 rounded-lg font-medium text-white shadow 
                            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>

                {/* Message */}
                {message.text && (
                    <div
                        className={`p-3 rounded-lg text-sm ${
                            message.type === "success"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Category Dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Select page
                    </label>
                    <select
                        value={selectedCategory || ""}
                        onChange={(e) => onChangeCategory(parseInt(e.target.value))}
                        className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="" disabled>
                            Choose a page
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Editor */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Content
                    </label>
                    <Editor
                        value={text}
                        onTextChange={(e) => {
                            if (e.htmlValue !== text) {
                                setText(e.htmlValue);
                            }
                        }}
                        style={{ height: "400px" }}
                        className="border rounded-md"
                    />
                </div>
            </div>
        </div>
    );
}
