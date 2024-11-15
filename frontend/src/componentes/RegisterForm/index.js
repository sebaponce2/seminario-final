import { useEffect, useState } from "react";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    email: "",
    password: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (field) => field !== ""
    );
    const noErrors = Object.values(errors).every((error) => error === "");
    setIsFormValid(allFieldsFilled && noErrors);
  }, [formData, errors]);

  const validateField = (name, value) => {
    let error = ''
    // eslint-disable-next-line default-case
    switch (name) {
      case 'nombre':
      case 'apellido':
        if (!/^[a-zA-Z]+$/.test(value)) {
          error = `El ${name} solo debe contener letras.`
        }
        break
      case 'edad':
        if (parseInt(value) < 18) {
          error = 'Debes ser mayor de 18 años para registrarte.'
        }
        break
      case 'email':
        if (!value.endsWith('@gmail.com')) {
          error = 'Debes ingresar un email válido.'
        }
        break
      case 'password':
        if (value.length < 6 || value.length > 30) {
          error = 'La contraseña debe tener entre 6 y 30 caracteres.'
        } else if (!/[a-z]/.test(value)) {
          error = 'La contraseña debe incluir al menos una letra minúscula.'
        } else if (!/[A-Z]/.test(value)) {
          error = 'La contraseña debe incluir al menos una letra mayúscula.'
        } else if (!/[0-9]/.test(value)) {
          error = 'La contraseña debe incluir al menos un número.'
        } else if (!/[^a-zA-Z0-9]/.test(value)) {
          error = 'La contraseña debe incluir al menos un carácter especial.'
        }
        break
      case 'telefono':
        if (!/^\d{10}$/.test(value)) {
          error = 'Ingresa un número de teléfono válido (10 dígitos).'
        }
        break
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Formulario enviado", formData);
    }
  };

  const renderInput = (name, label, type = "text", placeholder) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-black">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`mt-1 block w-full px-3 py-2 bg-white border ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-black focus:ring-1 focus:ring-black`}
        required
        aria-invalid={errors[name] ? "true" : "false"}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500" id={`${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderInput("nombre", "Nombre", "text", "Escriba su nombre")}
        {renderInput("apellido", "Apellido", "text", "Escriba su apellido")}
        {renderInput("edad", "Edad", "number", "Indique su edad")}
        {renderInput("email", "Email", "email", "Escriba su correo electrónico")}
        {renderInput("password", "Contraseña", "password", "Escriba su contraseña")}
        {renderInput("telefono", "Teléfono", "tel", "Indique su número de teléfono")}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                       ${
                         isFormValid
                           ? "bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                           : "bg-gray-300 cursor-not-allowed"
                       }`}
          aria-disabled={!isFormValid}
        >
          Registrarme
        </button>
      </form>
    </div>
  );
};
