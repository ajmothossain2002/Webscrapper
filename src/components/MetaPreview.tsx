"use client";

import Image from "next/image";

interface MetaPreviewProps {
  meta: {
    title: string;
    description: string;
    image?: string;
  };
}

export default function MetaPreview({ meta }: MetaPreviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Preview</h3>

      {/* Facebook Preview */}
      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        {meta.image && (
          <div className="w-full">
            <Image
              src={meta.image}
              alt="Facebook preview"
              width={600}
              height={250}
              className="object-cover w-full rounded-t-lg"
            />
          </div>
        )}
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase">facebook.com</p>
          <h4 className="font-semibold text-gray-900 mt-1">
            {meta.title || "Title goes here"}
          </h4>
          <p className="text-sm text-gray-700 mt-1">
            {meta.description || "Description goes here"}
          </p>
        </div>
      </div>

      {/* Twitter Preview */}
      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <div className="flex">
          {meta.image && (
            <div className="flex-shrink-0">
              <Image
                src={meta.image}
                alt="Twitter preview"
                width={128}
                height={128}
                className="object-cover rounded-l-lg"
              />
            </div>
          )}
          <div className="p-4 flex-1">
            <p className="text-xs text-gray-500">@yourhandle</p>
            <h4 className="font-semibold text-gray-900 mt-1">
              {meta.title || "Title goes here"}
            </h4>
            <p className="text-sm text-gray-700 line-clamp-2 mt-1">
              {meta.description || "Description goes here"}
            </p>
          </div>
        </div>
      </div>

      {/* Discord Preview */}
      <div className="border rounded-lg shadow-sm bg-[#2f3136] text-white overflow-hidden">
        {meta.image && (
          <div className="w-full">
            <Image
              src={meta.image}
              alt="Discord preview"
              width={600}
              height={250}
              className="object-cover w-full rounded-t-lg"
            />
          </div>
        )}
        <div className="p-4">
          <p className="text-xs text-gray-400">Posted in #general</p>
          <h4 className="font-semibold mt-1">
            {meta.title || "Title goes here"}
          </h4>
          <p className="text-sm text-gray-300 mt-1">
            {meta.description || "Description goes here"}
          </p>
        </div>
      </div>

      {/* Instagram Preview */}
      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        {meta.image ? (
          <Image
            src={meta.image}
            alt="Instagram preview"
            width={600}
            height={400}
            className="object-cover w-full rounded-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900">
            {meta.title || "Instagram Post Title"}
          </h4>
          <p className="text-sm text-gray-700 mt-1">
            {meta.description || "Description goes here"}
          </p>
        </div>
      </div>
    </div>
  );
}
