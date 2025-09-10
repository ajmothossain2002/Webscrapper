"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { isValidUrl } from "../libs/validateUrl";
import { useMetaTag } from "@/hooks/useMetaTag";

const MetaEditor = dynamic(() => import("@/components/MetaEditor"), {
  loading: () => <p className="text-center text-gray-500">Loading editor...</p>,
  ssr: false,
});
const MetaPreview = dynamic(() => import("@/components/MetaPreview"), {
  loading: () => (
    <p className="text-center text-gray-500">Loading preview...</p>
  ),
  ssr: false,
});
const MetaCopy = dynamic(() => import("@/components/MetaCopy"), {
  loading: () => (
    <p className="text-center text-gray-500">Loading copy tool...</p>
  ),
  ssr: false,
});

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [metaData, setMetaData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const { data, isLoading, error } = useMetaTag(url);

  useEffect(() => {
    if (data && !hasLoadedOnce) {
      setMetaData({
        title: data.title || "",
        description: data.description || "",
        image: data.image || "",
      });
      setHasLoadedOnce(true);
    }
  }, [data, hasLoadedOnce]);

  const handleCheck = () => {
    if (isValidUrl(inputUrl)) {
      setUrl(inputUrl);
      setHasLoadedOnce(false); // Reset only if you want to allow multiple first loads
    } else {
      alert("Please enter a valid URL.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-full mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Meta-Tag Scraper
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 max-w-5xl mx-auto">
          <input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter your website URL"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleCheck}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                Checking...
              </>
            ) : (
              "Check Website"
            )}
          </button>
        </div>

        <div className="text-center min-h-[2rem] max-w-5xl mx-auto">
          {error && (
            <p className="text-red-500">Error loading meta tags. Try again.</p>
          )}
        </div>

        {hasLoadedOnce && (
          <div className="max-w-full mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-4 border border-gray-200 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  Edit Meta Tags
                </h2>
                <div className="flex-1 overflow-auto">
                  <MetaEditor meta={metaData} onChange={(field, value) =>
                    setMetaData((prev) => ({ ...prev, [field]: value }))
                  } />
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4 border border-gray-200 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  Preview
                </h2>
                <div className="flex-1 overflow-auto">
                  <MetaPreview meta={metaData} />
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-4 border border-gray-200 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  Copy HTML
                </h2>
                <div className="flex-1 overflow-auto">
                  <MetaCopy meta={metaData} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
