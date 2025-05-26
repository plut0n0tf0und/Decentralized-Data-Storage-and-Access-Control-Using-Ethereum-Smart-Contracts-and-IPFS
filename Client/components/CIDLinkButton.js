import React from "react";

const CIDLinkButton = ({ cid }) => {
  const fullUrl = `https://gateway.lighthouse.storage/ipfs/${cid}`;

  return (
    <div className="text-center mt-6">
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition-all"
      >
        Open File 🔗
      </a>
      <p className="mt-3 text-sm text-gray-600 break-words"></p>
    </div>
  );
};

export default CIDLinkButton;
