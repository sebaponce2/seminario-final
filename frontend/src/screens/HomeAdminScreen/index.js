import React, { useEffect, useState } from "react";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { getPostsUserAdmin } from "../../services/posts";

export const HomeAdminScreen = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { token } = loadFromLocalStorage("auth");

    const data = await getPostsUserAdmin(token);

    if (data) {
      setPosts(data);
    }

    console.log("token:", token);
  };
  return (
    <div className="min-h-screen bg-[#E5E7EA] p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Publicaciones Pendientes de Revisión
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div
            key={post.product_id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-2">{post.location}</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                  post.type === "Servicio"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {post.type.charAt(0).toUpperCase() +
                  post.type.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
