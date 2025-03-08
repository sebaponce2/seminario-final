import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { SUPER_ADMIN } from "../../constants/enums";
import AdminNav from "./AdminNav";
import UserNav from "./UserNav";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    (async () => {
      const auth = await loadFromLocalStorage("auth");
      setUser(auth);
    })();
  }, []);

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={user?.role === SUPER_ADMIN ? "/homeAdmin" : "/home"}
          className="text-xl font-bold"
        >
          TruequeUp
        </Link>
        {user?.role === SUPER_ADMIN ? (
          <AdminNav user={user} />
        ) : (
          <UserNav user={user} />
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
    </nav>
  );
};