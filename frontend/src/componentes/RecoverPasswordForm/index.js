import { useEffect, useState } from "react";

const RecoverPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsValidEmail(email.endsWith("@gmail.com"));
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail) {
      setMessage("Se te ha enviado un mail para reestablecer tu contraseña.");
    }
  };

  return (
    <div>
      {!message ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Ingrese su email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Escriba su email"
              required
            />
            {email && !isValidEmail && (
              <p className="mt-1 text-sm text-red-600">
                Ingrese un email válido.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValidEmail}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isValidEmail
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Recuperar contraseña
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-green-600 text-center">{message}</p>
      )}
    </div>
  );
};

export default RecoverPasswordForm;
