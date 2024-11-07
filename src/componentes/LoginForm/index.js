import React from 'react'
import { Link } from "react-router-dom";

export const LoginForm = () => {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo o Usuario
        </label>
        <input
          id="email"
          type="text"
          placeholder="Ingrese su correo o usuario"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="Ingrese su contraseña"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
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
            to="/forgot-password"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Olvidé mi contraseña
          </Link>
        </div>
      </div>
    </form>
  )
}