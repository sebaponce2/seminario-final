import React from "react";

// Datos de ejemplo (en una aplicación real, estos datos vendrían de props o de una API)
const truequeData = {
  estado: "intercambiado", // Puede ser "en espera de confirmación" o "intercambiado    "
  productoOfrecido: {
    nombre: "Bicicleta de ruta",
    foto: "https://biciurbana.com.ar/14393-large_default/bicicleta-de-ruta-volta-brest-2x9-sora.jpg",
  },
  productoAObtener: {
    nombre: "Bicicleta de montaña",
    foto: "https://acdn.mitiendanube.com/stores/052/201/products/bic17004-2-55cf21793040d3416d17105388835775-1024-1024.png",
  },
  personaIntercambio: {
    nombre: "Ana",
    apellido: "García",
    foto: "https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg",
  },
};

export const BarteringDetails = () => {
  const handleConfirmarTrueque = () => {
    // Lógica para confirmar el trueque
    console.log("Trueque confirmado");
  };

  return (
    <div className="min-h-screen bg-[#E5E7EA] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Detalle del Trueque
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Producto Ofrecido */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-black">
              Bien Ofrecido
            </h2>
            <img
              src={truequeData.productoOfrecido.foto}
              alt={truequeData.productoOfrecido.nombre}
              className="w-40 h-40 object-cover rounded-lg mx-auto"
            />
            <p className="text-md text-black text-center">
              {truequeData.productoOfrecido.nombre}
            </p>
          </div>

          {/* Producto a Obtener */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-black">
              Bien a Obtener
            </h2>
            <img
              src={truequeData.productoAObtener.foto}
              alt={truequeData.productoAObtener.nombre}
              className="w-40 h-40 object-cover rounded-lg mx-auto"
            />
            <p className="text-md text-black text-center">
              {truequeData.productoAObtener.nombre}
            </p>

            {/* Información de la persona para intercambiar */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <img
                src={truequeData.personaIntercambio.foto}
                alt={`${truequeData.personaIntercambio.nombre} ${truequeData.personaIntercambio.apellido}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-black">A intercambiar con:</p>
                <p className="text-gray-700">
                  {truequeData.personaIntercambio.nombre}{" "}
                  {truequeData.personaIntercambio.apellido}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full">
        <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold mt-4 ${
                truequeData.estado === "intercambiado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {truequeData.estado.charAt(0).toUpperCase() + truequeData.estado.slice(1)}
              </span>
        </div>

        {/* Botón de Confirmar Trueque */}
        {truequeData.estado === "en espera de confirmación" && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleConfirmarTrueque}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              Confirmar Trueque
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
