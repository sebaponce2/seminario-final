export const validateEmail = (email) => {
    if (!email.endsWith("@gmail.com")) {
      return "Ingrese un email correcto";
    }
    return "";
  };
  
  export const validatePassword = (password) => {
    if (password.length < 6 || password.length > 30) {
      return "La contraseña debe tener entre 6 y 30 caracteres.";
    } else if (!/[a-z]/.test(password)) {
      return "La contraseña debe incluir al menos una letra minúscula.";
    } else if (!/[A-Z]/.test(password)) {
      return "La contraseña debe incluir al menos una letra mayúscula.";
    } else if (!/[0-9]/.test(password)) {
      return "La contraseña debe incluir al menos un número.";
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      return "La contraseña debe incluir al menos un carácter especial.";
    }
    return "";
  };
  