import React from 'react';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo
const misPublicaciones = [
  { id: 1, titulo: "Silla de oficina", imagen: "https://www.quamo.com.ar/3510-thickbox_default/silla-link-negra-neumatica-ecocuero.jpg", estado: "disponible" },
  { id: 2, titulo: "Clases de pasteleria", imagen: "https://www.bettycrocker.lat/mx/wp-content/uploads/sites/2/2020/12/BCmexico-recipe-pastel-arcoiris.png", estado: "intercambiado" },
  { id: 3, titulo: "Guitarra", imagen: "https://www.heavenimagenes.com/heavencommerce/e11e0483-99c8-4ad2-b3a9-bfb26fc81402/images/v2/YAMAHA/0704121327551540_01_large.jpg", estado: "no aprobado" },
  { id: 4, titulo: "Servicio de jardinería", imagen: "https://fiasa.com.ar/wp-content/uploads/2020/11/shutterstock_153976919.jpg", estado: "en proceso de validación" },
  { id: 5, titulo: "Cámara Instantánea", imagen: "https://http2.mlstatic.com/D_NQ_NP_945164-MLA43951551947_102020-O.webp", estado: "disponible" },
  { id: 6, titulo: "Clases de guitarra", imagen: "https://images.freeimages.com/images/large-previews/2ee/hands-playing-guitar-1528655.jpg", estado: "intercambiado" },
];

const estadoClases = {
  disponible: "bg-green-100 text-green-800",
  intercambiado: "bg-blue-100 text-blue-800",
  "no aprobado": "bg-red-100 text-red-800",
  "en proceso de validación": "bg-yellow-100 text-yellow-800"
};

export const MyPostsScreen = () => {
  const navigate = useNavigate();

  const handleClick = (id, estado) => {
    if (estado !== "no aprobado") {
      navigate(`/postDescription/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Mis Publicaciones
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {misPublicaciones.map((publicacion) => (
          <div
            key={publicacion.id}
            className={`rounded-lg overflow-hidden shadow-md transition-shadow duration-300 ${
              publicacion.estado === "no aprobado"
                ? "bg-gray-300 opacity-50"
                : "bg-gray-100 cursor-pointer hover:shadow-lg"
            }`}
            onClick={() => handleClick(publicacion.id, publicacion.estado)}
          >
            <img
              src={publicacion.imagen}
              alt={publicacion.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-black">{publicacion.titulo}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${estadoClases[publicacion.estado]}`}>
                {publicacion.estado.charAt(0).toUpperCase() + publicacion.estado.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}