import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../../hooks/useLocaleStorage";
import { createNewPost, getCategoriesClient, getProvincesClient } from "../../services/posts";
import { SuccessPostModal } from "../../componentes/SuccessPostModal";

export const CreatePostScreen = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_id: "",
    category_id:"",
    images: [],
  });
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isService = searchParams.get("isService") === "true";

  useEffect(() => {
    getProvinces();
    getCategories();
  },[]);

  const getProvinces = async () => {
    const { token } = loadFromLocalStorage("auth");
    const data = await getProvincesClient(token);

    if (data) {
      setProvinces(data);
    }
  };

  const getCategories = async () => {
      const { token } = loadFromLocalStorage("auth");
      const data = await getCategoriesClient(token);
  
      if (data) {
        setCategories(data);
      }
    }

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
    formData.category_id &&
    formData.images.length > 0;

  const handleSubmit = async () => {
    if (isFormValid) {
      const { user_id, token } = await loadFromLocalStorage("auth");

      const body = {
        ...formData,
        user_id,
        isService,
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
        saveToLocalStorage("savedPost", body);
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
            Categoría
          </label>
          <select
            id="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option key="" value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
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
            <option key="" value="">Selecciona una provincia</option>
            {provinces.map((prov) => (
              <option key={prov.location_id} value={prov.location_id}>
                {prov.name}
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
