/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import {
  getCategoriesClient,
  getPostsUserClient,
  getProvincesClient,
} from "../../services/posts";
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";

export const HomeScreen = () => {
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const filteredProducts = posts.filter((post) => {
    const matchesProvince =
      selectedProvince === "" || post.location === selectedProvince;
    const matchesCategory =
      selectedCategory === "" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvince && matchesSearch && matchesCategory;
  });

  useEffect(() => {
    getData();
    getProvinces();
    getCategories();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const { token } = loadFromLocalStorage("auth");
    const data = await getPostsUserClient(token);

    if (data) {
      setPosts(data);
    }
    setIsLoading(false);
  };

  const getProvinces = async () => {
    const { token } = loadFromLocalStorage("auth");
    const data = await getProvincesClient(token);

    if (data) {
      setProvinces(data);
    }
  };

  const getCategories = async () => {
    const { token } = loadFromLocalStorage("auth");
    const data = await getCategoriesClient(token);

    if (data) {
      setCategories(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-96px)]">
            <Loader type="spinner-default" bgColor={"#000"} size={80} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar de Categorías */}
            <aside className="w-full md:w-64">
              <h2 className="text-2xl font-bold mb-6">Categorías</h2>
              <nav>
                <ul className="mb-3">
                  <li key="">
                    <a
                      href="#"
                      onClick={() => setSelectedCategory("")}
                      className={`${
                        selectedCategory === ""
                          ? "text-black font-bold"
                          : "text-gray-600 font-medium"
                      } hover:text-gray-900 transition-colors`}
                    >
                      Todas las categorías
                    </a>
                  </li>
                </ul>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.category_id}>
                      <a
                        href="#"
                        onClick={() => setSelectedCategory(category.name)}
                        className={`${
                          selectedCategory === category.name
                            ? "text-black font-bold"
                            : "text-gray-600 font-medium"
                        } hover:text-gray-900 transition-colors`}
                      >
                        {category.name}
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
                  {provinces.map((prov) => (
                    <option key={prov.location_id} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Título de la sección */}
              <h1 className="text-2xl font-bold mb-6">
                Todos los Bienes y Servicios
              </h1>

              {/* Grid de productos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((post, index) => (
                  <article
                    onClick={() => {
                      const { product_id } = post;
                      navigate("/detailsPost", { state: product_id });
                    }}
                    key={index}
                    className="bg-white rounded-lg overflow-hidden border-2 border-gray-100 bg-black cursor-pointer"
                  >
                    <img
                      src={post?.images[0]}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-500 mb-1">{post.location}</p>
                      <p className="text-gray-500">{post.category}</p>
                    </div>
                  </article>
                ))}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
