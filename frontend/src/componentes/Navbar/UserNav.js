import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const UserNav = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const createDropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleCreateDropdown = () => setIsCreateDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        createDropdownRef.current &&
        !createDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsCreateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hidden md:flex items-center space-x-4">
      <div ref={createDropdownRef} className="relative">
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
              onClick={() => setIsCreateDropdownOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Bien
            </Link>
            <Link
              to="/createPost?isService=true"
              onClick={() => setIsCreateDropdownOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Servicio
            </Link>
          </div>
        )}
      </div>
      <div ref={dropdownRef} className="relative">
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
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Mi perfil
            </Link>
            <Link
              to="/myPosts"
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Mis publicaciones
            </Link>
            <a
              href="#"
              onClick={() => {
                navigate("/barteringHistory", { state: user?.user_id });
                setIsDropdownOpen(false);
              }}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Historial de trueques
            </a>
            <Link
              to="/login"
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Cerrar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNav;