import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/products" className="text-xl font-bold">TruequeUp</Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/createProduct"
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300"
          >
            + Crear producto
          </Link>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span>John Doe</span>
              <img
                src="https://picsum.photos/200/300"
                alt="Usuario"
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Datos personales
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Mis productos
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Historial de trueques
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Cerrar sesión
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4">
          <Link
            to="/createProduct"
            className="block w-full text-left bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300 mb-2"
          >
            + Crear producto
          </Link>
          <div className="bg-gray-800 rounded-md p-4">
            <div className="flex items-center space-x-2 mb-4">
              <span>John Doe</span>
              <img
                src="https://picsum.photos/200/300"
                alt="Usuario"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <a href="#" className="block py-2">
              Datos personales
            </a>
            <a href="#" className="block py-2">
              Mis productos
            </a>
            <a href="#" className="block py-2">
              Historial de trueques
            </a>
            <a href="#" className="block py-2">
              Cerrar sesión
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
