import React from "react";
import { Link } from "react-router-dom";

export const SuccessPostScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E7EA]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-black">
          Revisión de la Publicación
        </h1>
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-lg text-gray-700 mb-8">
          La publicación ha sido enviada a revisión. Te estaremos notificando su
          estado a través de un mail.
        </p>
        <Link
          to="/products"
          onClick={() => console.log("Volver al inicio")}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
