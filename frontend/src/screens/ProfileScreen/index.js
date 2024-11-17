import React from 'react'

export const ProfileScreen = () => {
  const profile = {
    name: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@gmail.com',
    age: 30,
    phone: '1112346789',
    credits: 2500,
    photoUrl: 'https://picsum.photos/200/300'
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <img
            src={profile.photoUrl}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full border-4 border-black mb-4"
          />
          <h1 className="text-2xl font-bold text-black mb-2">
            {profile.name} {profile.lastName}
          </h1>
          <p className="text-gray-600 mb-4">{profile.email}</p>
        </div>
        <div className="space-y-2 text-black">
          <p><span className="font-semibold">Edad:</span> {profile.age}</p>
          <p><span className="font-semibold">Teléfono:</span> {profile.phone}</p>
        </div>
      </div>
    </div>
  )
}