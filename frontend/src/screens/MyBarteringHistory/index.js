import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo
const trueques = [
  {
    id: 1,
    producto: "iPhone 12 Pro",
    imagen: "https://m.media-amazon.com/images/I/711PvTS05pL.jpg",
    estado: "intercambiado",
    productoOfrecido: "MacBook Air",
    productoAceptado: "iPhone 12 Pro",
    ofrendero: {
      nombre: "Ana",
      apellido: "García",
      foto: "/placeholder.svg?height=100&width=100"
    }
  },
  {
    id: 2,
    producto: "Bicicleta de montaña",
    imagen: "https://acdn.mitiendanube.com/stores/052/201/products/bic17004-2-55cf21793040d3416d17105388835775-1024-1024.png",
    estado: "en espera de confirmación",
    productoOfrecido: "Bicicleta de montaña",
    productoAceptado: "PlayStation 5",
    ofrendero: {
      nombre: "Carlos",
      apellido: "Rodríguez",
      foto: "/placeholder.svg?height=100&width=100"
    }
  },
  // Agrega más trueques aquí...
];

export const MyBarteringHistory = () => {
  const navigate = useNavigate();
  const [selectedTrueque, setSelectedTrueque] = useState(null);

  const handleTruequeClick = (trueque) => {
    setSelectedTrueque(trueque);
    navigate(`/trueque/${trueque.id}`);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Historial de Trueques
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trueques.map((trueque) => (
          <div
            key={trueque.id}
            className="bg-gray-100 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleTruequeClick(trueque)}
          >
            <img
              src={trueque.imagen}
              alt={trueque.producto}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-black">{trueque.producto}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                trueque.estado === "intercambiado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {trueque.estado.charAt(0).toUpperCase() + trueque.estado.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedTrueque && (
        <DetalleTrueque trueque={selectedTrueque} onClose={() => setSelectedTrueque(null)} />
      )}
    </div>
  );
};

const DetalleTrueque = ({ trueque, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-black">Detalle del Trueque</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-black">Producto Ofrecido</h3>
            <p>{trueque.productoOfrecido}</p>
          </div>
          <div>
            <h3 className="font-semibold text-black">Producto Aceptado</h3>
            <p>{trueque.productoAceptado}</p>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <img
            src={trueque.ofrendero.foto}
            alt={`${trueque.ofrendero.nombre} ${trueque.ofrendero.apellido}`}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="font-semibold text-black">Ofrendero</h3>
            <p>{`${trueque.ofrendero.nombre} ${trueque.ofrendero.apellido}`}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};