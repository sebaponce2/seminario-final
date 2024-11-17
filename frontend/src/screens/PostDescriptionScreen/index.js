import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const publicacion = {
  id: 1,
  nombre: "Clases de guitarra",
  fotos: [
    "https://images.freeimages.com/images/large-previews/2ee/hands-playing-guitar-1528655.jpg",
    "https://images.freeimages.com/images/large-previews/2ee/hands-playing-guitar-1528655.jpg",
    "https://images.freeimages.com/images/large-previews/2ee/hands-playing-guitar-1528655.jpg",
  ],
  creador: {
    nombre: "Juan",
    apellido: "Pérez",
    foto: "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
  },
  locacion: "Buenos Aires, Argentina",
  descripcion:
    "Ofrezco clases particulares de guitarra para principiantes e intermedios. Aprende desde las bases hasta técnicas avanzadas, incluyendo teoría musical y canciones populares. Flexibilidad horaria y clases personalizadas según tus intereses musicales.",
  esMiPublicacion: false,
  tipo: "servicio",
};


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

export const PostDescriptionScreen = ({ isAdmin = true, userId = 101 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  return (
    <div className="min-h-screen bg-[#E5E7EA] p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Carrusel de fotos */}
        <div className="relative">
          <Slider {...settings}>
            {publicacion.fotos.map((foto, index) => (
              <div
                key={index}
                className="h-96 cursor-pointer"
                onClick={() => openModal(index)}
              >
                <img
                  src={foto}
                  alt={`Foto ${index + 1} de ${publicacion.nombre}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="p-6">
          {/* Información de la publicación */}
          <h1 className="text-3xl font-bold mb-4">{publicacion.nombre}</h1>

          <div className="flex items-center mb-4">
            <img
              src={publicacion.creador.foto}
              alt={`${publicacion.creador.nombre} ${publicacion.creador.apellido}`}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{`${publicacion.creador.nombre} ${publicacion.creador.apellido}`}</p>
              <p className="text-gray-600">{publicacion.locacion}</p>
            </div>
          </div>

          {isAdmin && (
            <div className="mb-4">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                  publicacion.tipo === "bien"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {publicacion.tipo.charAt(0).toUpperCase() +
                  publicacion.tipo.slice(1)}
              </span>
            </div>
          )}

          {/* Descripción en un cuadro */}
          <div className="mb-8 p-4 border border-gray-300 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <p>{publicacion.descripcion}</p>
          </div>

          {/* Botones de acción */}
          {isAdmin ? (
            <div className="flex flex-col gap-4">
              {publicacion.tipo === "bien" && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300">
                    Visualizar video
                  </button>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300">
                  Aprobar
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300">
                  Rechazar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              {userId === 102 ? (
                <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300">
                  Ver listado de solicitudes
                </button>
              ) : (
                <>
                  <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300">
                    Enviar un mensaje
                  </button>
                  <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300">
                    Solicitar trueque
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
              {publicacion.fotos.map((foto, index) => (
                <div key={index}>
                  <img
                    src={foto}
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
