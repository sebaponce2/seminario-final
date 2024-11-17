/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Search } from "lucide-react";

const categories = [
  "Muebles",
  "Ropa",
  "Autos",
  "Servicios",
  "Electrodomésticos",
  "Juguetes",
  "Construcción",
  "Salud",
  "Higiene",
];

const provinces = [
  "Buenos Aires",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Entre Ríos",
  "Salta",
  "Chaco",
  "Corrientes",
  "Santiago del Estero",
  "San Juan",
  "Jujuy",
];

const products = [
  {
    name: "Sillón de cuero",
    province: "Buenos Aires",
    category: "Muebles",
    image:
      "https://mijormi.vteximg.com.br/arquivos/ids/173628-1000-1332/Sillon-clasico-cuero-SILLON-CHESTERFIELD-CUERO-HARNESS-124-Landmark-0.jpg?v=637707763572300000",
  },
  {
    name: "Camisa de algodón",
    province: "Córdoba",
    category: "Ropa",
    image:
      "https://www.roperialeonardoberazategui.com.ar/wp-content/uploads/2020/07/RCA-0004-Verde_3.jpg",
  },
  {
    name: "Licuadora",
    province: "Santa Fe",
    category: "Electrodomésticos",
    image:
      "https://promart.vteximg.com.br/arquivos/ids/8038318-1000-1000/146429.jpg?v=638550399397300000",
  },
  {
    name: "Muñeca de peluche",
    province: "Mendoza",
    category: "Juguetes",
    image:
      "https://i5.walmartimages.com/asr/fd4e2ff1-44d1-4c35-8a28-29c761b3f9de.bf06c2b1dae184aea306e1c2541929d4.png?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
  },
  {
    name: "Kit de primeros auxilios",
    province: "Tucumán",
    category: "Salud",
    image:
      "https://cvfaunia.com/wp-content/uploads/2021/11/empleo-3-1024x683.jpg",
  },
  {
    name: "Shampoo orgánico",
    province: "Entre Ríos",
    category: "Higiene",
    image:
      "https://p.turbosquid.com/ts-thumb/h1/2OPzpv/9t/z0000/jpg/1700461568/1920x1080/turn_fit_q99/04a159fd810ccdb6e67c7ae9a8a2d01e330c80d5/z0000-1.jpg",
  },
];

export const HomeScreen = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesProvince =
      selectedProvince === "" || product.province === selectedProvince;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvince && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de Categorías */}
          <aside className="w-full md:w-64">
            <h2 className="text-2xl font-bold mb-6">Categorías</h2>
            <nav>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1">
            {/* Barra de búsqueda y filtro */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar bien o servicio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
              >
                <option value="">Todas las provincias</option>
                {provinces.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Título de la sección */}
            <h1 className="text-2xl font-bold mb-6">Todos los Bienes y Servicios</h1>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <article
                  key={index}
                  className="bg-white rounded-lg overflow-hidden border-2 border-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-500 mb-1">{product.province}</p>
                    <p className="text-gray-500">{product.category}</p>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
