import { LoginForm } from "../../componentes/LoginForm"


export const LoginScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-200">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}