import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../../hooks/useLocaleStorage";
import {
  createNewPost,
  getCategoriesClient,
  getProvincesClient,
} from "../../services/posts";
import { SuccessPostModal } from "../../componentes/SuccessPostModal";
import { Input } from "../../componentes/CreatePostScreen/Input";
import { SelectDropdown } from "../../componentes/CreatePostScreen/SelectDropdown";
import { SubmitButton } from "../../componentes/CreatePostScreen/SubmitButton";
import { ImageSelector } from "../../componentes/CreatePostScreen/ImageSelector";

export const CreatePostScreen = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_id: "",
    category_id: "",
    images: [],
  });
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isService = searchParams.get("isService") === "true";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { token } = loadFromLocalStorage("auth");
    const [provData, catData] = await Promise.all([
      getProvincesClient(token),
      getCategoriesClient(token, false),
    ]);
    setProvinces(provData || []);
    setCategories(catData || []);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      const { user_id, token } = loadFromLocalStorage("auth");
      const body = { ...formData, user_id, isService };

      if (isService) {
        try {
          const response = await createNewPost(body, token);
          if (response) setIsSubmitted(true);
        } catch (error) {
          console.log("Error al crear publicación:", error);
        }
      } else {
        saveToLocalStorage("savedPost", body);
        navigate("/recordValidation");
      }
    }
  };

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.location_id &&
    ((!isService && formData.category_id) ||
      (isService && !formData.category_id)) &&
    formData.images.length > 0;

  return isSubmitted ? (
    <SuccessPostModal />
  ) : (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Crear Publicación de {isService ? "Servicio" : "Bien"}
      </h1>
      <div className="max-w-3xl mx-auto">
        <ImageSelector formData={formData} setFormData={setFormData} />
        <Input
          id="title"
          label={`Nombre del ${isService ? "servicio" : "bien"}`}
          value={formData.title}
          onChange={handleInputChange}
        />
        <Input
          id="description"
          label="Descripción (máximo 250 caracteres)"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange}
          maxLength={250}
        />
        {!isService && (
          <SelectDropdown
            id="category_id"
            label="Categoría"
            options={categories}
            value={formData.category_id}
            onChange={handleInputChange}
          />
        )}
        <SelectDropdown
          id="location_id"
          label="Provincia"
          options={provinces}
          value={formData.location_id}
          onChange={handleInputChange}
        />
        <SubmitButton
          isValid={isFormValid}
          onClick={handleSubmit}
          label={isService ? "Finalizar" : "Siguiente"}
        />
      </div>
    </div>
  );
};