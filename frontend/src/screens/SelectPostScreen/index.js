import React, { useState } from 'react';

const publicaciones = [
    { id: 1, titulo: "Silla de oficina", imagen: "https://www.quamo.com.ar/3510-thickbox_default/silla-link-negra-neumatica-ecocuero.jpg", tipo: "bien", ofertado: false },
    { id: 2, titulo: "Clases de pasteleria", imagen: "https://www.bettycrocker.lat/mx/wp-content/uploads/sites/2/2020/12/BCmexico-recipe-pastel-arcoiris.png", tipo: "servicio", ofertado: true },
    { id: 3, titulo: "Guitarra", imagen: "https://www.heavenimagenes.com/heavencommerce/e11e0483-99c8-4ad2-b3a9-bfb26fc81402/images/v2/YAMAHA/0704121327551540_01_large.jpg", tipo: "bien", ofertado: false },
    { id: 4, titulo: "Servicio de jardinería", imagen: "https://fiasa.com.ar/wp-content/uploads/2020/11/shutterstock_153976919.jpg", tipo: "servicio", ofertado: false },
    { id: 5, titulo: "Cámara Instantánea", imagen: "https://http2.mlstatic.com/D_NQ_NP_945164-MLA43951551947_102020-O.webp", tipo: "bien", ofertado: true },
    { id: 6, titulo: "Clases de guitarra", imagen: "https://images.freeimages.com/images/large-previews/2ee/hands-playing-guitar-1528655.jpg", tipo: "servicio", ofertado: false },
  ];
  

export const SelectPostScreen = ({ offerType = "bien" }) => {
  const [seleccionado, setSeleccionado] = useState(null);

  // Filtrar y ordenar publicaciones
  const publicacionesFiltradas = publicaciones
    .filter(pub => pub.tipo === offerType)
    .sort((a, b) => {
      if (a.ofertado === b.ofertado) return 0;
      return a.ofertado ? 1 : -1;
    });

  const handleSeleccion = (id) => {
    setSeleccionado(id === seleccionado ? null : id);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Seleccione uno de sus {offerType === "bien" ? "Bienes" : "Servicios"}
      </h1>
      
      <div className="mb-6 flex justify-between items-center">
        <button
          className={`bg-black text-white px-4 py-2 rounded-md ${
            seleccionado ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!seleccionado}
        >
          Solicitar Trueque
        </button>
        <p className="text-black">
          {seleccionado ? "Publicación seleccionada" : "Seleccione una publicación"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {publicacionesFiltradas.map((publicacion) => (
          <div
            key={publicacion.id}
            className={`${publicacion.ofertado ? "bg-gray-300 opacity-50" : "bg-gray-100" } rounded-lg overflow-hidden shadow-md ${
              !publicacion.ofertado && 'cursor-pointer hover:shadow-lg transition-shadow duration-300'
            } ${seleccionado === publicacion.id ? 'ring-2 ring-black' : ''}`}
            onClick={() => !publicacion.ofertado && handleSeleccion(publicacion.id)}
          >
            <img
              src={publicacion.imagen}
              alt={publicacion.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-black">{publicacion.titulo}</h3>
              {publicacion.ofertado && (
                <span className="bg-gray-900 text-white text-sm py-1 px-2 rounded-full">
                  Ofertado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}