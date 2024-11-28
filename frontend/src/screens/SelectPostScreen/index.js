import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createNewExchangeRequest,
  getMyPostsToExchange,
} from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";

export const SelectPostScreen = () => {
  const [selected, setSelected] = useState(null);
  const [auth, setAuth] = useState();
  const [posts, setPosts] = useState();
  const [body, setBody] = useState();

  const location = useLocation();
  const { state: post } = location || {};

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const auth = loadFromLocalStorage("auth");
    setAuth(auth);
    const isService = post.type !== "Bien";

    const data = await getMyPostsToExchange(
      auth.user_id,
      isService,
      auth.token
    );

    if (data) {
      setPosts(data);
    }
  };

  const handleSelection = (offering_product_id) => {
    setSelected(offering_product_id === selected ? null : offering_product_id);
    setBody({
      offering_user_id: auth.user_id,
      requesting_user_id: post.post_creator.user_id,
      offering_product_id,
      requesting_product_id: post.product_id,
    });
  };

  const handleSubmit = async () => {
    try {
      await createNewExchangeRequest(body, auth.token);
      navigate("/detailsPost", {
        state: post.product_id,
      });
    } catch (error) {
      console.log("Error en la creación de solicitud:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Seleccione uno de sus {post.type === "Bien" ? "Bienes" : "Servicios"}
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handleSubmit}
          className={`bg-black text-white px-4 py-2 rounded-md ${
            selected
              ? "opacity-100 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!selected}
        >
          Solicitar Trueque
        </button>
        <p className="text-black">
          {selected ? "Publicación seleccionada" : "Seleccione una publicación"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts?.map((post) => (
          <div
            key={post?.product_id}
            className={`${
              post.state === "OFFERED"
                ? "bg-gray-300 opacity-50"
                : "bg-gray-100"
            } rounded-lg overflow-hidden shadow-md ${
              post.state !== "OFFERED" &&
              "cursor-pointer hover:shadow-lg transition-shadow duration-300"
            } ${selected === post.product_id ? "ring-2 ring-black" : ""}`}
            onClick={() =>
              post.state !== "OFFERED" && handleSelection(post.product_id)
            }
          >
            <img
              src={post?.images[0]}
              alt={post?.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-black">
                {post?.title}
              </h3>
              {post.state === "OFFERED" && (
                <span className="bg-gray-900 text-white text-sm py-1 px-2 rounded-full">
                  Ofrecido para trueque
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
