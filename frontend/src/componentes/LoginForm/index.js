import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../../plugins/providers";
import { getUserLogin } from "../../services/user";
import { saveToLocalStorage } from "../../hooks/useLocaleStorage";
import { validateEmail, validatePassword } from "../../utils/validation";
import { CLIENT } from "../../constants/enums";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [serviceRunning, setServiceRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError });

    const allFieldsValid = !emailError && !passwordError;
    const allFieldsFilled =
      formData.email.trim() !== "" && formData.password.trim() !== "";

    setIsFormValid(allFieldsValid && allFieldsFilled);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    setErrorMessage("");
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServiceRunning(true);
    try {
      const result = await logIn(formData);
      if (result.ok) {
        const { token, uid } = result;
        const response = await getUserLogin(uid, token);
        if (response) {
          const auth = {
            ...response,
            token,
          };
          saveToLocalStorage("auth", auth);

          navigate(`${response.role === CLIENT ? "/home" : "/homeAdmin"}`);
        }
      } else {
        setErrorMessage("El email y/o la contraseña no son correctos");
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error, por favor intente nuevamente");
    } finally {
      setServiceRunning(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="text"
          placeholder="Ingrese su correo electrónico"
          required
          className={`w-full px-3 py-2 border ${
            errors.email && touchedFields.email
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.email && touchedFields.email}
          aria-describedby={
            errors.email && touchedFields.email ? "email-error" : undefined
          }
        />
        {errors.email && touchedFields.email && (
          <p className="text-red-500 text-sm" id="email-error">
            {errors.email}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="Ingrese su contraseña"
          required
          className={`w-full px-3 py-2 border ${
            errors.password && touchedFields.password
              ? "border-red-500"
              : "border-gray-300"
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.password && touchedFields.password}
          aria-describedby={
            errors.password && touchedFields.password
              ? "password-error"
              : undefined
          }
        />
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!isFormValid || serviceRunning}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isFormValid && !serviceRunning
            ? "bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        aria-disabled={!isFormValid || serviceRunning}
      >
        Iniciar Sesión
      </button>
      <div className="space-y-4 pt-2">
        <Link
          to="/register"
          className="w-full block text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Registrarse
        </Link>
        <div className="text-center">
          <Link
            to="/recoverPassword"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Olvidé mi contraseña
          </Link>
        </div>
      </div>
    </form>
  );
};
