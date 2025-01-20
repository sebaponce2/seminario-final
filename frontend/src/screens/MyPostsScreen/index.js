import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REJECTED } from "../../constants/enums";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { getMyPostsClient } from "../../services/posts";
import { classStatus, labels } from "../../constants/labels";
import Loader from "react-js-loader";

export const MyPostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { token } = loadFromLocalStorage("auth");
    const data = await getMyPostsClient(token);

    if (data) {
      setPosts(data);
    }
    setIsLoading(false);
  };

  const handleClick = (product_id, state) => {
    if (state !== REJECTED) {
      navigate("/detailsPost", { state: product_id });
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-96px)]">
          <Loader type="spinner-default" bgColor={"#000"} size={80} />
        </div>
      ) : (
        <div className="min-h-screen bg-white p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Mis Publicaciones
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <div
                key={post.product_id}
                className={`rounded-lg overflow-hidden shadow-md transition-shadow duration-300 ${
                  post.state === REJECTED
                    ? "bg-gray-300 opacity-50"
                    : "bg-gray-100 cursor-pointer hover:shadow-lg"
                }`}
                onClick={() => handleClick(post.product_id, post.state)}
              >
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-black">
                    {post.title}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      classStatus[post.state]
                    }`}
                  >
                    {labels[post.state]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};