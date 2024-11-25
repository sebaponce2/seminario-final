import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { createNewPost } from "../../services/posts";
import { SuccessPostModal } from "../../componentes/SuccessPostModal";

const provinciasArgentina = [
  { id: 1, value: "Buenos Aires" },
  { id: 2, value: "Catamarca" },
  { id: 3, value: "Chaco" },
  { id: 4, value: "Chubut" },
  { id: 5, value: "Córdoba" },
  { id: 6, value: "Corrientes" },
  { id: 7, value: "Entre Ríos" },
  { id: 8, value: "Formosa" },
  { id: 9, value: "Jujuy" },
  { id: 10, value: "La Pampa" },
  { id: 11, value: "La Rioja" },
  { id: 12, value: "Mendoza" },
  { id: 13, value: "Misiones" },
  { id: 14, value: "Neuquén" },
  { id: 15, value: "Río Negro" },
  { id: 16, value: "Salta" },
  { id: 17, value: "San Juan" },
  { id: 18, value: "San Luis" },
  { id: 19, value: "Santa Cruz" },
  { id: 20, value: "Santa Fe" },
  { id: 21, value: "Santiago del Estero" },
  { id: 22, value: "Tierra del Fuego" },
  { id: 23, value: "Tucumán" },
];

export const CreatePostScreen = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_id: "",
    images: [],
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isService = searchParams.get("isService") === "true";

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...base64Images].slice(0, 5),
        }));
      })
      .catch((error) => {
        console.error("Error al convertir las imágenes a Base64:", error);
      });
  };

  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.location_id &&
    formData.images.length > 0;

  const handleSubmit = async () => {
    if (isFormValid) {
      const { user_id, token } = await loadFromLocalStorage("auth");
      
      const body = {
        ...formData,
        user_id,
        category_id: 1,
      };

      if (isService) {
        try {
          const response = await createNewPost(body, token);
          
          if (response) {
            setIsSubmitted(true);
          }
        } catch (error) {
          console.log("Error al crear nueva publicación:", error);
        }
      } else {
        loadFromLocalStorage("savedPost", body);
        navigate("/recordValidation");
      }
    }
  };

  return isSubmitted ? (
    <SuccessPostModal />
  ) : (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">{`Crear Publicación de ${
        isService ? "Servicio" : "Bien"
      }`}</h1>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-medium text-black"
            htmlFor="images"
          >
            Cargar imágenes (máximo 5)
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={formData.images.length >= 5}
            className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
            >
              {formData.images[index] ? (
                <>
                  <img
                    src={formData.images[index]}
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
            htmlFor="title"
          >
            {`Nombre del ${isService ? "servicio" : "bien"}`}
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-medium text-black"
            htmlFor="description"
          >
            Descripción (máximo 250 caracteres)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value.slice(0, 250),
              }))
            }
            maxLength={250}
            rows={4}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/250 caracteres
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
            id="location_id"
            value={formData.location_id}
            onChange={handleInputChange}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="">Selecciona una provincia</option>
            {provinciasArgentina.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.value}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          disabled={!isFormValid}
          onClick={handleSubmit}
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
