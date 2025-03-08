import React from "react";
import { Trash2 } from "lucide-react";

export const ImageSelector = ({ formData, setFormData }) => {
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
      .catch((error) => console.error("Error al convertir las imágenes:", error));
  };

  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-medium text-black" htmlFor="images">
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {formData.images[index] ? (
              <>
                <img src={formData.images[index]} alt={`Producto ${index + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => handleDeleteImage(index)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </>
            ) : (
              <span className="text-gray-400">Imagen {index + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
