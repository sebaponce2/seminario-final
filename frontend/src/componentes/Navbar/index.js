import React, { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { SUPER_ADMIN } from "../../constants/enums";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [user, setUser] = useState();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleCreateDropdown = () =>
    setIsCreateDropdownOpen(!isCreateDropdownOpen);

  useEffect(() => {
    getAuth();
  }, []);

  const getAuth = async () => {
    const auth = await loadFromLocalStorage("auth");
    setUser(auth);
  };

  const AdminNav = () => (
    <div
      onClick={toggleDropdown}
      className="flex items-center space-x-4 cursor-pointer"
    >
      <span>Administrador</span>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <img
            src={
              user?.profile_picture ??
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt="Logo de administrador"
            className="w-8 h-8 rounded-full object-cover"
          />
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
            <Link
              to="/login"
              onClick={toggleDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Cerrar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const UserNav = () => (
    <div className="hidden md:flex items-center space-x-4">
      <div className="relative">
        <button
          onClick={toggleCreateDropdown}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300 flex items-center"
          aria-haspopup="true"
          aria-expanded={isCreateDropdownOpen}
        >
          + Crear publicación
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform duration-200 ${
              isCreateDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isCreateDropdownOpen && (
          <div className="absolute z-50 left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1">
            <Link
              to="/createPost?isService=false"
              onClick={toggleCreateDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Bien
            </Link>
            <Link
              to="/createPost?isService=true"
              onClick={toggleCreateDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Servicio
            </Link>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <span>{`${user?.name} ${user?.last_name}`}</span>
          <img
            src={
              user?.profile_picture ??
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt="Usuario"
            className="w-8 h-8 rounded-full object-cover"
          />
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
            <Link
              to="/profile"
              onClick={toggleDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Mi perfil
            </Link>
            <a
              href="#"
              onClick={toggleDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Mis publicaciones
            </a>
            <a
              href="#"
              onClick={toggleDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Historial de trueques
            </a>
            <Link
              to="/login"
              onClick={toggleDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Cerrar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {user?.role === SUPER_ADMIN ? (
          <>
            <Link to="/homeAdmin" className="text-xl font-bold">
              TruequeUp
            </Link>
            <AdminNav />
          </>
        ) : (
          <>
            <Link to="/home" className="text-xl font-bold">
              TruequeUp
            </Link>
            <UserNav />
          </>
        )}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isOpen && user?.role !== SUPER_ADMIN && (
        <div className="md:hidden mt-4">
          <button
            onClick={toggleCreateDropdown}
            className="block w-full text-left bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300 mb-2"
          >
            + Crear publicación
          </button>
          {isCreateDropdownOpen && (
            <div className="bg-white text-black rounded-md shadow-lg py-1 mb-2">
              <Link
                to="/createPost?isService=false"
                onClick={toggleCreateDropdown}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Bien
              </Link>
              <Link
                to="/createPost?isService=true"
                onClick={toggleCreateDropdown}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Servicio
              </Link>
            </div>
          )}
          <div className="bg-gray-800 rounded-md p-4 mt-2 z-50">
            <div className="flex items-center space-x-2 mb-4">
              <span>{`${user?.name} ${user?.last_name}`}</span>
              <img
                src={
                  user.profile_picture ??
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="Usuario"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <Link onClick={toggleMenu} to="/profile" className="block py-2">
              Datos personales
            </Link>
            <a href="#" className="block py-2">
              Mis publicaciones
            </a>
            <a href="#" className="block py-2">
              Historial de trueques
            </a>
            <Link onClick={toggleMenu} to="/login" className="block py-2">
              Cerrar sesión
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
