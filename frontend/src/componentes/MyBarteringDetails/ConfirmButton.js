import React from "react";

const ConfirmButton = ({ onConfirm }) => (
  <div className="mt-6 flex justify-center">
    <button
      onClick={onConfirm}
      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
    >
      Confirmar Trueque
    </button>
  </div>
);

export default ConfirmButton;