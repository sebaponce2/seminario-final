import { useEffect, useState } from "react";
import { register } from "../../plugins/providers";
import { createNewUser } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { encryptPassword } from "../../utils/encrypt";
import { Input } from "./Input";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    profile_picture: "",
    role_id: 1,
    name: "",
    last_name: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    register_date: new Date(),
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serviceRunning, setServiceRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const allRequiredFieldsFilled = Object.entries(formData).every(
      ([key, value]) => key === "profile_picture" || value !== ""
    );
    const noErrors = Object.values(errors).every((error) => !error);

    setIsFormValid(allRequiredFieldsFilled && noErrors);
  }, [formData, errors]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
      case "last_name":
        if (!/^[a-zA-Z]+$/.test(value)) {
          error = `El ${
            name === "name" ? "nombre" : "apellido"
          } solo debe contener letras.`;
        }
        break;
      case "age":
        if (parseInt(value) < 18 || isNaN(parseInt(value))) {
          error = "Debes ser mayor de 18 años para registrarte.";
        }
        break;
      case "email":
        if (!value.endsWith("@gmail.com")) {
          error = "Debes ingresar un email válido que termine en @gmail.com.";
        }
        break;
      case "password":
        if (value.length < 6 || value.length > 30) {
          error = "La contraseña debe tener entre 6 y 30 caracteres.";
        } else if (!/[a-z]/.test(value)) {
          error = "La contraseña debe incluir al menos una letra minúscula.";
        } else if (!/[A-Z]/.test(value)) {
          error = "La contraseña debe incluir al menos una letra mayúscula.";
        } else if (!/[0-9]/.test(value)) {
          error = "La contraseña debe incluir al menos un número.";
        } else if (!/[^a-zA-Z0-9]/.test(value)) {
          error = "La contraseña debe incluir al menos un carácter especial.";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          error = "Ingresa un número de teléfono válido (10 dígitos).";
        }
        break;
      default:
        error = ""; // Para campos no validados
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          setFormData((prevState) => ({
            ...prevState,
            [name]: base64Image,
          }));
          setPreviewUrl(base64Image);
        };
        reader.readAsDataURL(file);
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: "",
        }));
        setPreviewUrl(null);
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      const error = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServiceRunning(true);
    if (isFormValid) {
      try {
        const userValidation = await register(formData);

        if (userValidation.ok) {
          const { uid, token } = userValidation;

          const body = {
            ...formData,
            uid,
            password: encryptPassword(formData.password),
          };

          await createNewUser(body, token);
          navigate("/login");
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "El mail ya se encuentra registrado",
          }));
        }
      } catch (error) {
        console.log("Error en la creación de usuario:", error);
      } finally {
        setServiceRunning(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="profile_picture"
            className="block text-sm font-medium text-black"
          >
            Foto de perfil <span className="text-gray-500">(Opcional)</span>
          </label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-black file:text-white
                       hover:file:bg-gray-800"
          />
          {previewUrl && (
            <div className="mt-2 flex">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        <Input
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          name={"name"}
          label={"Nombre"}
          type="text"
          placeholder={"Escriba su nombre"}
        />
        <Input
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          name={"last_name"}
          label={"Apellido"}
          type="text"
          placeholder={"Escriba su apellido"}
        />
        <Input
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          name={"age"}
          label={"Edad"}
          type="number"
          placeholder={"Indique su edad"}
        />
        <Input
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          name={"email"}
          label={"Email"}
          type="email"
          placeholder={"Escriba su correo electrónico"}
        />
        <Input
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          name={"password"}
          label={"Contraseña"}
          type="password"
          placeholder={"Escriba su contraseña"}
        />
        <Input
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          name={"phone"}
          label={"Teléfono"}
          type="tel"
          placeholder={"Indique su número de teléfono"}
        />
        <button
          type="submit"
          disabled={!isFormValid || serviceRunning}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
    ${
      isFormValid && !serviceRunning
        ? "bg-black hover:bg-gray-800"
        : "bg-gray-300 cursor-not-allowed"
    }`}
          aria-disabled={!isFormValid || serviceRunning}
        >
          Registrarme
        </button>
      </form>
    </div>
  );
};
