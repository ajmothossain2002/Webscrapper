"use client";

interface MetaCopyProps {
  meta: {
    title: string;
    description: string;
    image?: string;
  };
}

export default function MetaCopy({ meta }: MetaCopyProps) {
  const code = `
<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:image" content="${meta.image || ""}" />
  `.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert("✅ Meta tags copied to clipboard!");
    });
  };

  return (
    <div className="max-w-md mx-auto rounded-xl shadow-md border border-gray-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Copy Meta Tags
      </h3>

      <div className="bg-gray-100 text-gray-800 font-mono text-sm p-3 rounded-lg mb-4 overflow-x-auto whitespace-pre-wrap break-words">
        {code}
      </div>

      <button
        onClick={copyToClipboard}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Copy Meta Tags
      </button>
    </div>
  );
}
