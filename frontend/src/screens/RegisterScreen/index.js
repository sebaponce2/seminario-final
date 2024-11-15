import { RegisterForm } from "../../componentes/RegisterForm";

export const RegisterScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E7EA]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Registrarme
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
}
