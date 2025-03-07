import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../../plugins/providers";
import { getUserLogin } from "../../services/user";
import { saveToLocalStorage } from "../../hooks/useLocaleStorage";
import { validateEmail, validatePassword } from "../../utils/validation";
import { CLIENT } from "../../constants/enums";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

export const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [touchedFields, setTouchedFields] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [serviceRunning, setServiceRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setErrors({ email: emailError, password: passwordError });
    setIsFormValid(!emailError && !passwordError && formData.email && formData.password);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    setErrorMessage("");
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouchedFields((prev) => ({ ...prev, [id]: true }));
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
          saveToLocalStorage("auth", { ...response, token });
          navigate(response.role === CLIENT ? "/home" : "/homeAdmin");
        }
      } else {
        setErrorMessage("El email y/o la contraseña no son correctos");
      }
    } catch {
      setErrorMessage("Ocurrió un error, por favor intente nuevamente");
    } finally {
      setServiceRunning(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="email"
        type="text"
        label="Correo electrónico"
        placeholder="Ingrese su correo electrónico"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touchedFields.email}
      />
      <Input
        id="password"
        type="password"
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touchedFields.password}
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <SubmitButton disabled={!isFormValid || serviceRunning} loading={serviceRunning}>
        Iniciar Sesión
      </SubmitButton>
      <div className="space-y-4 pt-2">
        <Link to="/register" className="w-full block text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Registrarse
        </Link>
        <div className="text-center">
          <Link to="/recoverPassword" className="text-sm text-gray-600 hover:text-gray-900">
            Olvidé mi contraseña
          </Link>
        </div>
      </div>
    </form>
  );
};
