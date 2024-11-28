import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { exchangeConfirmation, getDetailsExchange } from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import {
  CONFIRMED_USER_EXCHANGE,
  EXCHANGE_COMPLETED,
  WAITING_USER_CONFIRMATION,
} from "../../constants/enums";

export const BarteringDetails = () => {
  const [exchangeData, setExchangeData] = useState();
  const [auth, setAuth] = useState();
  const location = useLocation();
  const { state: postDescription } = location || {};

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const auth = await loadFromLocalStorage("auth");
    setAuth(auth);
    const requesting_product_id = postDescription?.product_id;

    try {
      const data = await getDetailsExchange(requesting_product_id, auth.token);
      setExchangeData(data);
    } catch (error) {
      console.log("Error al obtener detalles del trueque", error);
    }
  };

  const handleConfirmExchange = async (user_id) => {
    const body = {
      exchange_id: exchangeData?.exchange?.exchange_id,
      offering_user_id:
        exchangeData?.offering_user?.user?.id === user_id ? user_id : null,
      requesting_user_id:
        exchangeData?.requesting_user?.user?.id === user_id ? user_id : null,
    };

    try {
      const data = await exchangeConfirmation(body, auth.token);

      if (data) {
        setExchangeData((prev) => ({
          ...prev,
          exchange: {
            ...prev.exchange,
            status_offering_user:
              prev?.offering_user?.user?.id === user_id
                ? CONFIRMED_USER_EXCHANGE
                : prev?.exchange?.status_offering_user,
            status_requesting_user:
              prev?.requesting_user?.user?.id === user_id
                ? CONFIRMED_USER_EXCHANGE
                : prev?.exchange?.status_requesting_user,
          },
        }));
      }
    } catch (error) {
      console.log("Error al modificar el estado de confirmacion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EA] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Detalle del Trueque
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Producto Ofrecido */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-black">
              Bien Ofrecido
            </h2>
            <img
              src={
                exchangeData?.offering_user?.user?.id === auth?.user_id
                  ? exchangeData?.offering_user?.product?.images[0]
                  : exchangeData?.requesting_user?.product?.images[0]
              }
              alt={
                exchangeData?.offering_user?.user?.id === auth?.user_id
                  ? exchangeData?.offering_user?.product?.title
                  : exchangeData?.requesting_user?.product?.title
              }
              className="w-40 h-40 object-cover rounded-lg mx-auto"
            />
            <p className="text-md text-black text-center">
              {exchangeData?.offering_user?.user?.id === auth?.user_id
                ? exchangeData?.offering_user?.product?.title
                : exchangeData?.requesting_user?.product?.title}
            </p>
          </div>

          {/* Producto a Obtener */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-black">
              Bien a Obtener
            </h2>
            <img
              src={
                exchangeData?.offering_user?.user?.id === auth?.user_id
                  ? exchangeData?.requesting_user?.product?.images[0]
                  : exchangeData?.offering_user?.product?.images[0]
              }
              alt={
                exchangeData?.offering_user?.user?.id === auth?.user_id
                  ? exchangeData?.requesting_user?.product?.title
                  : exchangeData?.offering_user?.product?.title
              }
              className="w-40 h-40 object-cover rounded-lg mx-auto"
            />
            <p className="text-md text-black text-center">
              {exchangeData?.offering_user?.user?.id === auth?.user_id
                ? exchangeData?.requesting_user?.product?.title
                : exchangeData?.offering_user?.product?.title}
            </p>

            {/* Información de la persona para intercambiar */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <img
                src={
                  exchangeData?.offering_user?.user?.id === auth?.user_id
                    ? exchangeData?.requesting_user?.user?.profile_picture
                    : exchangeData?.offering_user?.user?.profile_picture
                }
                alt={
                  exchangeData?.offering_user?.user?.id === auth?.user_id
                    ? `${exchangeData?.requesting_user?.user?.name} ${exchangeData?.requesting_user?.user?.last_name}`
                    : `${exchangeData?.offering_user?.user?.name} ${exchangeData?.offering_user?.user?.last_name}`
                }
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-black">A intercambiar con:</p>
                <p className="text-gray-700">
                  {exchangeData?.offering_user?.user?.id === auth?.user_id
                    ? `${exchangeData?.requesting_user?.user?.name} ${exchangeData?.requesting_user?.user?.last_name}`
                    : `${exchangeData?.offering_user?.user?.name} ${exchangeData?.offering_user?.user?.last_name}`}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <span
            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold mt-4 ${
              exchangeData?.exchange?.status === EXCHANGE_COMPLETED
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {exchangeData?.exchange?.status === EXCHANGE_COMPLETED
              ? "Intercambiado"
              : "En espera de confirmación"}
          </span>
        </div>

        {/* Botón de confirmar trueque / leyenda */}
        {exchangeData?.offering_user?.user?.id === auth?.user_id ? (
          exchangeData?.exchange?.status_offering_user ===
          WAITING_USER_CONFIRMATION ? (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleConfirmExchange(auth?.user_id)}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
              >
                Confirmar Trueque
              </button>
            </div>
          ) : exchangeData?.exchange?.status_requesting_user ===
            WAITING_USER_CONFIRMATION ? (
            <div className="mt-6 text-center text-gray-700">
              Esperando confirmación de intercambio
            </div>
          ) : null
        ) : exchangeData?.exchange?.status_requesting_user ===
          WAITING_USER_CONFIRMATION ? (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => handleConfirmExchange(auth?.user_id)}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              Confirmar Trueque
            </button>
          </div>
        ) : exchangeData?.exchange?.status_offering_user ===
          WAITING_USER_CONFIRMATION ? (
          <div className="mt-6 text-center text-gray-700">
            Esperando confirmación de intercambio
          </div>
        ) : null}
      </div>
    </div>
  );
};
