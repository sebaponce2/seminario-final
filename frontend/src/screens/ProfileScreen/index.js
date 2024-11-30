import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { getUserProfile } from "../../services/user";
import Loader from "react-js-loader";

export const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true); 
      const auth = loadFromLocalStorage("auth");
      const data = await getUserProfile(auth?.token);
      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.log("Error al obtener datos de perfil.", error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {isLoading ? (  
        <Loader type="spinner-default" bgColor={"#000"} size={80} />
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <img
              src={userProfile?.profile_picture}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-black mb-4"
            />
            <h1 className="text-2xl font-bold text-black mb-2">
              {userProfile?.name} {userProfile?.last_name}
            </h1>
            <p className="text-gray-600 mb-4">{userProfile?.email}</p>
          </div>
          <div className="space-y-2 text-black">
            <p>
              <span className="font-semibold">Edad:</span> {userProfile?.age}
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span>{" "}
              {userProfile?.phone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
