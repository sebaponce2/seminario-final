import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  getRequestsList,
  updateStatusExchangeRequest,
} from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { useLocation, useNavigate } from "react-router-dom";
import {
  EXCHANGE_IN_PROGRESS,
  PENDING_APPROVAL,
  REJECTED,
} from "../../constants/enums";
import Loader from "react-js-loader";

export const PostRequestsList = () => {
  const [requestsList, setRequestsList] = useState();
  const [auth, setAuth] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const { state: postDescription } = location || {};

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const statusDropdown = [
    {
      text: "Pendiente",
      status: PENDING_APPROVAL,
    },
    {
      text: "Confirmado",
      status: EXCHANGE_IN_PROGRESS,
    },
    {
      text: "Rechazado",
      status: REJECTED,
    },
  ];

  const getData = async () => {
    const auth = await loadFromLocalStorage("auth");
    setAuth(auth);

    const data = await getRequestsList(postDescription?.product_id, auth.token);

    if (data) {
      console.log("data:", data);
      setRequestsList(data);
    }

    setIsLoading(false);
  };

  const handleChangeState = async (product_requests_id, newStatus) => {
    try {
      const body = {
        status: newStatus,
        product_requests_id,
      };
      await updateStatusExchangeRequest(body, auth.token);

      setRequestsList(
        requestsList.map((request) =>
          request.product_requests_id === product_requests_id
            ? { ...request, status: newStatus }
            : request
        )
      );

      if (newStatus === EXCHANGE_IN_PROGRESS) {
        navigate("/detailsPost", {
          state: postDescription?.product_id,
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EA] flex items-center justify-center p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-96px)]">
          <Loader type="spinner-default" bgColor={"#000"} size={80} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">
              Solicitudes de Trueque
            </h1>
            <ul className="space-y-4">
              {requestsList?.map((request) => (
                <li
                  key={request?.offering_product_id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <img
                      src={request?.user_requesting?.profile_photo}
                      alt={request?.user_requesting?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <h2 className="font-semibold">{`${request?.user_requesting?.name} ${request?.user_requesting?.last_name}`}</h2>
                  </div>
                  <div className="flex items-start space-x-4">
                    <img
                      src={
                        Array.isArray(request?.offering_product_images) &&
                        request?.offering_product_images[0]
                          ? request.offering_product_images[0]
                          : "URL_DE_IMAGEN_POR_DEFECTO"
                      }
                      alt="Producto"
                      className="w-10 h-10 object-cover rounded-md"
                    />

                    <p className="text-sm text-gray-600 flex-1">
                      {request?.offering_product_title}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() =>
                        navigate("/detailsPost", {
                          state: request.offering_product_id,
                        })
                      }
                      className="px-4 py-2 bg-black text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Ver publicación
                    </button>
                    <div className="relative">
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleChangeState(
                            request.product_requests_id,
                            e.target.value
                          )
                        }
                        className="block w-40 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      >
                        {statusDropdown.map((option) => (
                          <option key={option.status} value={option.status}>
                            {option.text}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        </div>
      )}
    </div>
  );
};
