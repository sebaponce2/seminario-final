/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHistoryExchanges } from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { EXCHANGE_COMPLETED } from "../../constants/enums";
import Loader from "react-js-loader";

export const MyBarteringHistory = () => {
  const navigate = useNavigate();
  const [exchanges, setExchanges] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const { state: user_id } = location || {};

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const { user_id, token } = await loadFromLocalStorage("auth");
      const data = await getHistoryExchanges(user_id, token);
      setExchanges(data);
    } catch (error) {
      console.log("Error al obtener el historial de trueques.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-[calc(100vh-96px)]">
      <Loader type="spinner-default" bgColor={"#000"} size={80} />
    </div>
  ) : (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Historial de Trueques
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exchanges?.map((exchange) => (
          <div
            key={exchange?.product_to_get?.id}
            className="bg-gray-100 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() =>
              navigate("/barteringDetails", {
                state: { product_id: exchange?.product_to_get?.id },
              })
            }
          >
            <img
              src={exchange?.product_to_get?.images[0]}
              alt={exchange?.product_to_get?.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-black">
                {exchange?.product_to_get?.title}
              </h3>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  exchange?.status === EXCHANGE_COMPLETED
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {exchange?.status === EXCHANGE_COMPLETED
                  ? "Intercambiado"
                  : "En espera de confirmación"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
