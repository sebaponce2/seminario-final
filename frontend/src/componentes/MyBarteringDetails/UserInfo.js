import React from "react";

const UserInfo = ({ name, profilePicture }) => (
  <div className="mt-4 flex items-center justify-center space-x-4">
    <img src={profilePicture} alt={name} className="w-10 h-10 rounded-full object-cover" />
    <div>
      <p className="font-medium text-black">A intercambiar con:</p>
      <p className="text-gray-700">{name}</p>
    </div>
  </div>
);

export default UserInfo;