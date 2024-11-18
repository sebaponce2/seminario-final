import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

const solicitudesIniciales = [
  {
    id: 1,
    usuario: {
      nombre: 'Luciano Rodriguez',
      foto: 'https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp '
    },
    producto: {
      foto: 'https://www.apapachos.com.ar/wp-content/uploads/2022/10/171-0063-1-Ropero-3P2C-Blanco-Family_2.jpg',
      descripcion: 'Ropero'
    },
    estado: 'Pendiente'
  },
  {
    id: 2,
    usuario: {
      nombre: 'María González',
      foto: 'https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp'
    },
    producto: {
      foto: 'https://static.hendel.com/media/catalog/product/cache/0c3e9ac8430b5a3e77d1544ae1698a10/4/5/45475-min.jpg',
      descripcion: 'Mesa de cocina'
    },
    estado: 'Pendiente'
  },
  // Puedes agregar más solicitudes aquí
];

export const PostRequestsList = () => {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);

  const cambiarEstado = (id, nuevoEstado) => {
    setSolicitudes(solicitudes.map(solicitud => 
      solicitud.id === id ? {...solicitud, estado: nuevoEstado} : solicitud
    ));
  };

  return (
    <div className="min-h-screen bg-[#E5E7EA] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Solicitudes de Trueque</h1>
        <ul className="space-y-4">
          {solicitudes.map((solicitud) => (
            <li key={solicitud.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-3">
                <img
                  src={solicitud.usuario.foto}
                  alt={solicitud.usuario.nombre}
                  className="w-10 h-10 rounded-full"
                />
                <h2 className="font-semibold">{solicitud.usuario.nombre}</h2>
              </div>
              <div className="flex items-start space-x-4">
                <img
                  src={solicitud.producto.foto}
                  alt="Producto"
                  className="w-10 h-10 object-cover rounded-md"
                />
                <p className="text-sm text-gray-600 flex-1">{solicitud.producto.descripcion}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => alert(`Ver publicación de producto ${solicitud.id}`)}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  Ver publicación
                </button>
                <div className="relative">
                  <select
                    value={solicitud.estado}
                    onChange={(e) => cambiarEstado(solicitud.id, e.target.value)}
                    className="block w-40 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                  <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}