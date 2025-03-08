import React from "react";
import { EXCHANGE_COMPLETED } from "../../constants/enums";

const ExchangeStatus = ({ status }) => (
  <div className="flex justify-center w-full">
    <span
      className={`inline-block px-2 py-1 rounded-full text-sm font-semibold mt-4 ${
        status === EXCHANGE_COMPLETED ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status === EXCHANGE_COMPLETED ? "Intercambiado" : "En espera de confirmación"}
    </span>
  </div>
);

export default ExchangeStatus;