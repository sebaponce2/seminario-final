import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createNewExchangeRequest,
  getMyPostsToExchange,
} from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import ActionBar from "../../componentes/SelectPostScreen/ActionBar";
import PostsGrid from "../../componentes/SelectPostScreen/PostsGrid";
import Loader from "react-js-loader";

export const SelectPostScreen = () => {
  const [selected, setSelected] = useState(null);
  const [auth, setAuth] = useState();
  const [posts, setPosts] = useState();
  const [body, setBody] = useState();
  const [isLoading, setIsLoading] = useState(true);

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

    setIsLoading(true);

    const data = await getMyPostsToExchange(
      auth.user_id,
      isService,
      auth.token
    );

    if (data) {
      setPosts(data);
    }

    setIsLoading(false);
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
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-96px)]">
          <Loader type="spinner-default" bgColor={"#000"} size={80} />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Seleccione uno de sus{" "}
            {post.type === "Bien" ? "Bienes" : "Servicios"}
          </h1>
          <ActionBar selected={selected} onSubmit={handleSubmit} />
          <PostsGrid
            posts={posts}
            selected={selected}
            onSelect={handleSelection}
          />
        </>
      )}
    </div>
  );
};