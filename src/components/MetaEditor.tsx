"use client";

import { ChangeEvent } from "react";

interface Meta {
  title: string;
  description: string;
  image: string;
}

interface MetaEditorProps {
  meta: Meta;
  onChange: (field: keyof Meta, value: string) => void;
}

export default function MetaEditor({ meta, onChange }: MetaEditorProps) {
  const handleInput =
    (field: keyof Meta) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(field, e.target.value);
    };

  return (
    <div className="max-w-md rounded-xl shadow-md border border-gray-200 bg-white p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Edit Metadata</h3>

      {/* Title */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={meta.title || ""}
          onChange={handleInput("title")}
          placeholder="Enter title"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={meta.description || ""}
          onChange={handleInput("description")}
          placeholder="Enter description"
          rows={3}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          value={meta.image || ""}
          onChange={handleInput("image")}
          placeholder="Enter image URL"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
