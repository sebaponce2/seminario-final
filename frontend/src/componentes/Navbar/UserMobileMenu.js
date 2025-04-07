import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const UserMobileMenu = ({ user, onClose }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  const toggleCreateDropdown = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  const handleNavigation = (path, state) => {
    if (state) {
      navigate(path, { state });
    } else {
      navigate(path);
    }
    onClose();
  };

  return (
    <div className="md:hidden bg-black text-white border-t border-gray-700 py-2 absolute left-0 right-0 z-50 mt-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-3">
          <div
            className="flex items-center justify-between py-2"
            onClick={toggleCreateDropdown}
          >
            <span className="font-medium">+ Crear publicación</span>
            {isCreateOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {isCreateOpen && (
            <div className="pl-4 flex flex-col ">
              <Link
                to="/createPost?isService=false"
                onClick={onClose}
                className="pb-2"
              >
                Bien
              </Link>
              <Link
                to="/createPost?isService=true"
                onClick={onClose}
                className="py-2"
              >
                Servicio
              </Link>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <img
                src={
                  user?.profile_picture ??
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="Usuario"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{`${user?.name} ${user?.last_name}`}</span>
            </div>

            <div className="flex flex-col space-y-3 pl-2">
              <Link to="/profile" onClick={onClose} className="py-2">
                Mi perfil
              </Link>
              <Link
                to="/chats"
                onClick={onClose}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Chats
              </Link>
              <Link to="/myPosts" onClick={onClose} className="py-2">
                Mis publicaciones
              </Link>
              <button
                onClick={() =>
                  handleNavigation("/barteringHistory", user?.user_id)
                }
                className="text-left py-2"
              >
                Historial de trueques
              </button>
              <Link to="/login" onClick={onClose} className="py-2">
                Cerrar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMobileMenu;
