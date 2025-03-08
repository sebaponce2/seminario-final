import React from "react";

export const SubmitButton = ({ isValid, onClick, label }) => {
  return (
    <button
      type="button"
      disabled={!isValid}
      onClick={onClick}
      className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
        isValid ? "bg-black hover:bg-black/90 focus:ring-4 focus:outline-none focus:ring-blue-300" : "bg-gray-300 cursor-not-allowed"
      }`}
    >
      {label}
    </button>
  );
};