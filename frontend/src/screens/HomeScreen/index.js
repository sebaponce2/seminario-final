import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { getCategoriesClient, getPostsUserClient, getProvincesClient } from "../../services/posts";
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";
import Sidebar from "../../componentes/HomeScreen/Sidebar";
import SearchBar from "../../componentes/HomeScreen/SearchBar";
import ProductGrid from "../../componentes/HomeScreen/ProductGrid";

export const HomeScreen = () => {
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    getProvinces();
    getCategories();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const { token } = loadFromLocalStorage("auth");
    const data = await getPostsUserClient(token);
    if (data) setPosts(data);
    setIsLoading(false);
  };

  const getProvinces = async () => {
    const { token } = loadFromLocalStorage("auth");
    const data = await getProvincesClient(token);
    if (data) setProvinces(data);
  };

  const getCategories = async () => {
    const { token } = loadFromLocalStorage("auth");
    const data = await getCategoriesClient(token, true);
    if (data) setCategories(data);
  };

  const filteredProducts = posts.filter((post) => {
    const matchesProvince = selectedProvince === "" || post.location === selectedProvince;
    const matchesCategory = selectedCategory === "" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvince && matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-96px)]">
            <Loader type="spinner-default" bgColor={"#000"} size={80} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <Sidebar categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <main className="flex-1">
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                selectedProvince={selectedProvince} 
                setSelectedProvince={setSelectedProvince} 
                provinces={provinces} 
              />
              <h1 className="text-2xl font-bold mb-6">Todos los Bienes y Servicios</h1>
              <ProductGrid posts={filteredProducts} navigate={navigate} />
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
