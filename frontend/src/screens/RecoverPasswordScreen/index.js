import RecoverPasswordForm from "../../componentes/RecoverPasswordForm";

export const RecoverPasswordScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E7EA]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Recuperar Contraseña
        </h2>
        <RecoverPasswordForm />
      </div>
    </div>
  );
};
