import React from 'react';

const publicaciones = [
  { id: 1, nombre: 'Silla de oficina', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Buenos Aires', tipo: 'bien' },
  { id: 2, nombre: 'Clases de guitarra', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Córdoba', tipo: 'servicio' },
  { id: 3, nombre: 'iPhone 12', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Mendoza', tipo: 'bien' },
  { id: 4, nombre: 'Diseño gráfico', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Santa Fe', tipo: 'servicio' },
  { id: 5, nombre: 'Bicicleta de montaña', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Tucumán', tipo: 'bien' },
  { id: 6, nombre: 'Clases de inglés', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Entre Ríos', tipo: 'servicio' },
  { id: 7, nombre: 'Laptop Dell', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Salta', tipo: 'bien' },
  { id: 8, nombre: 'Reparación de electrodomésticos', imagen: 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png', provincia: 'Chaco', tipo: 'servicio' },
];

export const HomeAdminScreen = () => {
  return (
    <div className="min-h-screen bg-[#E5E7EA] p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Publicaciones Pendientes de Revisión</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {publicaciones.map((publicacion) => (
          <div key={publicacion.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={publicacion.imagen} 
              alt={publicacion.nombre} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">{publicacion.nombre}</h2>
              <p className="text-gray-600 mb-2">{publicacion.provincia}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                publicacion.tipo === 'servicio' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {publicacion.tipo.charAt(0).toUpperCase() + publicacion.tipo.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}