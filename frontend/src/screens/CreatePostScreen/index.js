import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const provinciasArgentina = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export const CreatePostScreen = () => {
  const [imagenes, setImagenes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [provincia, setProvincia] = useState("");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const isService = searchParams.get("isService") === "true";

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImagenes((prev) => [...prev, ...newImages].slice(0, 5));
  };

  const handleDeleteImage = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = nombre && descripcion && provincia && imagenes.length > 0;

  const validateNextScreen = () => {
    if (isFormValid) {
      if (isService) {
        navigate("/success");
      } else {
        navigate("/recordValidation");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">{`Crear Publicación de ${
        isService ? "Servicio" : "Bien"
      }`}</h1>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-medium text-black"
            htmlFor="imagenes"
          >
            Cargar imágenes (máximo 5)
          </label>
          <input
            type="file"
            id="imagenes"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={imagenes.length >= 5}
            className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
            >
              {imagenes[index] ? (
                <>
                  <img
                    src={imagenes[index]}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </>
              ) : (
                <span className="text-gray-400">Imagen {index + 1}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-medium text-black"
            htmlFor="nombre"
          >
            {`Nombre del ${isService ? "servicio" : "bien"}`}
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-medium text-black"
            htmlFor="descripcion"
          >
            Descripción (máximo 250 caracteres)
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value.slice(0, 250))}
            maxLength={250}
            rows={4}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            {descripcion.length}/250 caracteres
          </p>
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-medium text-black"
            htmlFor="provincia"
          >
            Provincia
          </label>
          <select
            id="provincia"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="">Selecciona una provincia</option>
            {provinciasArgentina.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          disabled={!isFormValid}
          onClick={validateNextScreen}
          className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
            isFormValid
              ? "bg-black hover:bg-black/90 focus:ring-4 focus:outline-none focus:ring-blue-300"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {`${isService ? "Finalizar" : "Siguiente"}`}
        </button>
      </div>
    </div>
  );
};
