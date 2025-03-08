import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { exchangeConfirmation, getDetailsExchange } from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import {
  EXCHANGE_COMPLETED,
  WAITING_USER_CONFIRMATION,
} from "../../constants/enums";
import Loader from "react-js-loader";
import ProductDetails from "../../componentes/MyBarteringDetails/ProductDetails";
import UserInfo from "../../componentes/MyBarteringDetails/UserInfo";
import ExchangeStatus from "../../componentes/MyBarteringDetails/ExchangeStatus";
import ConfirmButton from "../../componentes/MyBarteringDetails/ConfirmButton";

export const BarteringDetails = () => {
  const [exchangeData, setExchangeData] = useState();
  const [auth, setAuth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { state: postDescription } = location || {};

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const auth = await loadFromLocalStorage("auth");
    setAuth(auth);

    try {
      const data = await getDetailsExchange(
        postDescription?.product_id,
        auth.token
      );
      setExchangeData(data);
    } catch (error) {
      console.log("Error al obtener detalles del trueque", error);
    } finally {
      setIsLoading(false);
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
            status: data?.status,
            status_offering_user: data?.status_offering_user,
            status_requesting_user: data?.status_requesting_user,
          },
        }));
      }
    } catch (error) {
      console.log("Error al modificar el estado de confirmacion:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader type="spinner-default" bgColor={"#000"} size={80} />
      </div>
    );
  }

  // Valida el producto ofrecido, producto obtenido y el usuario que realiza el trueque
  const isOfferingUser =
    exchangeData?.offering_user?.user?.id === auth?.user_id;
  const offeredProduct = isOfferingUser
    ? exchangeData?.offering_user?.product
    : exchangeData?.requesting_user?.product;
  const requestedProduct = isOfferingUser
    ? exchangeData?.requesting_user?.product
    : exchangeData?.offering_user?.product;
  const exchangePartner = isOfferingUser
    ? exchangeData?.requesting_user?.user
    : exchangeData?.offering_user?.user;

  return (
    <div className="min-h-screen bg-[#E5E7EA] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Detalle del Trueque
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductDetails
            title={offeredProduct?.title}
            image={offeredProduct?.images[0]}
            heading="Bien Ofrecido"
          />
          <div className="grid grid-cols-1">
            <ProductDetails
              title={requestedProduct?.title}
              image={requestedProduct?.images[0]}
              heading="Bien a Obtener"
            />
            <UserInfo
              name={`${exchangePartner?.name} ${exchangePartner?.last_name}`}
              profilePicture={exchangePartner?.profile_picture}
            />
          </div>
        </div>
        <ExchangeStatus status={exchangeData?.exchange?.status} />
        {exchangeData?.exchange?.status !== EXCHANGE_COMPLETED && (
          <>
            {(isOfferingUser
              ? exchangeData?.exchange?.status_offering_user
              : exchangeData?.exchange?.status_requesting_user) ===
            WAITING_USER_CONFIRMATION ? (
              <ConfirmButton
                onConfirm={() => handleConfirmExchange(auth?.user_id)}
              />
            ) : (
              <div className="mt-6 text-center text-gray-700">
                Esperando confirmación de intercambio
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};