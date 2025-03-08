import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const AdminNav = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={toggleDropdown} className="flex items-center space-x-4 cursor-pointer">
        <span>Administrador</span>
        <button
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
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
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
  );
};

export default AdminNav;