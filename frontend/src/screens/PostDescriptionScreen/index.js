import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  cancelRequestExchange,
  getDescriptionPost,
  updateStatusPost,
} from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { useLocation, useNavigate } from "react-router-dom";
import { PENDING_APPROVAL, SUPER_ADMIN } from "../../constants/enums";

const CustomArrow = ({ onClick, direction }) => {
  const positionClass = direction === "left" ? "left-2" : "right-2";

  return (
    <div
      onClick={onClick}
      className={`absolute top-1/2 transform -translate-y-1/2 ${positionClass} 
        bg-black/60 rounded-full p-2 cursor-pointer z-10 
        flex items-center justify-center hover:bg-black/80 transition duration-300`}
      style={{
        width: "40px",
        height: "40px",
      }}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-6 h-6 text-white" />
      ) : (
        <ChevronRight className="w-6 h-6 text-white" />
      )}
    </div>
  );
};

export const PostDescriptionScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [auth, setAuth] = useState();
  const [postDescription, setPostDescription] = useState();
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const location = useLocation();
  const { state: product_id } = location || {};

  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

  useEffect(() => {
    if (product_id) {
      getData();
    }
  }, []);

  const getData = async () => {
    const auth = loadFromLocalStorage("auth");
    const data = await getDescriptionPost(product_id, auth.token);
    setAuth(auth);
    console.log("auth:", auth);

    if (data) {
      console.log("data:", data);
      setPostDescription({ ...data, images: [...new Set(data?.images)] });
    }
  };

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  const handleVideoClick = () => {
    setIsVideoVisible(!isVideoVisible);
  };

  const handleChangePostStatus = async (isApproved) => {
    try {
      const body = {
        product_id,
        isApproved,
      };
      const response = await updateStatusPost(body, auth?.token);
      if (response) {
        navigate(auth.role === SUPER_ADMIN ? "/homeAdmin" : "/home");
      }
    } catch (error) {
      console.log("Error al cambiar estado de la publicación:", error);
    }
  };

  const handleCancelExchangeRequest = async () => {
    try {
      const body = {
        product_id,
      };
      await cancelRequestExchange(body, auth.token);
      setPostDescription((prev) => ({
        ...prev,
        user_post_status: null,
      }));
      
    } catch (error) {
      console.log("Error al cancelar trueque.");
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EA] p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Carrusel de fotos */}
        <div className="relative">
          <Slider {...settings}>
            {postDescription?.images?.map((image, index) => (
              <div
                key={index}
                className="h-96 cursor-pointer"
                onClick={() => openModal(index)}
              >
                <img
                  src={`${image}`}
                  alt={`Foto ${index} de ${postDescription?.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="p-6">
          {/* Información de la publicación */}
          <h1 className="text-3xl font-bold mb-4">{postDescription?.title}</h1>

          <div className="flex items-center mb-4">
            <img
              src={postDescription?.post_creator?.profile_picture}
              alt={`${postDescription?.post_creator?.name} ${postDescription?.post_creator?.last_name}`}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <p className="font-semibold">{`${postDescription?.post_creator?.name} ${postDescription?.post_creator?.last_name}`}</p>
              <p className="text-gray-600">{postDescription?.location}</p>
            </div>
          </div>

          {auth?.role === SUPER_ADMIN && (
            <div className="mb-4">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                  postDescription?.type === "Bien"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {postDescription?.type}
              </span>
            </div>
          )}

          {/* Descripción en un cuadro */}
          <div className="mb-8 p-4 border border-gray-300 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <p>{postDescription?.description}</p>
          </div>

          {/* Botones de acción */}
          {auth?.role === SUPER_ADMIN ? (
            <div className="flex flex-col gap-4">
              {postDescription?.type === "Bien" && (
                <div className=" sm:flex-row gap-4">
                  <button
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                    onClick={handleVideoClick}
                  >
                    {isVideoVisible ? "Cerrar video" : "Visualizar video"}
                  </button>
                  {isVideoVisible && postDescription?.video && (
                    <div className="mt-4">
                      <video
                        controls
                        className="w-full"
                        src={postDescription?.video}
                        alt="Video de publicación"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleChangePostStatus(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleChangePostStatus(false)}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              {auth?.user_id === postDescription?.post_creator?.user_id ? (
                <button
                  onClick={() => navigate("/requestsList")}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                >
                  Ver listado de solicitudes
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/chats")}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                  >
                    Enviar un mensaje
                  </button>
                  <button
                    onClick={() => {
                      postDescription?.user_post_status === PENDING_APPROVAL
                        ? handleCancelExchangeRequest()
                        : navigate("/selectPost", { state: postDescription });
                    }}
                    className={`${
                      postDescription?.user_post_status === PENDING_APPROVAL
                        ? "bg-red-800 hover:bg-red-700"
                        : "bg-black hover:bg-gray-800"
                    } text-white px-6 py-2 rounded-md transition duration-300`}
                  >
                    {postDescription?.user_post_status === PENDING_APPROVAL
                      ? "Cancelar solicitud"
                      : "Solicitar trueque"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={handleModalClick}
        >
          <div className="relative w-11/12 md:w-2/3">
            <Slider {...settings} initialSlide={selectedImageIndex}>
              {postDescription?.images?.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Foto ampliada ${index + 1}`}
                    className="w-full h-[75vh] object-contain"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};
