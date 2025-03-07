import React from "react";

const SubmitButton = ({ disabled, loading, children }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
        !disabled
          ? "bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          : "bg-gray-300 cursor-not-allowed"
      }`}
      aria-disabled={disabled}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
};

export default SubmitButton;
