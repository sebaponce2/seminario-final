import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  cancelRequestExchange,
  getDescriptionPost,
  updateStatusPost,
} from "../../services/posts";
import { loadFromLocalStorage } from "../../hooks/useLocaleStorage";
import { useLocation, useNavigate } from "react-router-dom";
import { SUPER_ADMIN } from "../../constants/enums";
import { validateChatClient } from "../../services/chats";
import ImageCarousel from "../../componentes/Carousel/Carousel";
import Loader from "react-js-loader";
import PostHeader from "../../componentes/PostDescriptionScreen/PostHeader";
import PostDescriptionBox from "../../componentes/PostDescriptionScreen/PostDescriptionBox";
import AdminActions from "../../componentes/PostDescriptionScreen/AdminActions";
import UserActions from "../../componentes/PostDescriptionScreen/UserActions";

export const PostDescriptionScreen = () => {
  const [auth, setAuth] = useState();
  const [postDescription, setPostDescription] = useState();
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const { state: product_id } = location || {};

  const navigate = useNavigate();

  useEffect(() => {
    if (product_id) {
      getData();
    }
  }, []);

  const getData = async () => {
    const auth = await loadFromLocalStorage("auth");
    const data = await getDescriptionPost(product_id, auth.token);
    setAuth(auth);

    if (data) {
      setPostDescription({ ...data, images: [...new Set(data?.images)] });
    }
    setIsLoading(false);
  };

  const handleVideoClick = () => {
    setIsVideoVisible(!isVideoVisible);
  };

  const handleChangePostStatus = async (isApproved) => {
    try {
      const body = {
        product_id,
        isApproved,
      };
      const response = await updateStatusPost(body, auth?.token);
      if (response) {
        navigate(auth.role === SUPER_ADMIN ? "/homeAdmin" : "/home");
      }
    } catch (error) {
      console.log("Error al cambiar estado de la publicación:", error);
    }
  };

  const handleCancelExchangeRequest = async () => {
    try {
      const body = {
        product_id,
      };
      await cancelRequestExchange(body, auth.token);
      setPostDescription((prev) => ({
        ...prev,
        user_post_status: null,
      }));
    } catch (error) {
      console.log("Error al cancelar trueque.");
    }
  };

  const handleSendMessage = async () => {
    try {
      const data = await validateChatClient(
        auth.token,
        auth.user_id,
        postDescription?.post_creator?.user_id
      );
      if (data) {
        navigate("/chats", { state: data.chat_id });
      }
    } catch (error) {
      console.log("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EA] p-4 md:p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-96px)]">
          <Loader type="spinner-default" bgColor={"#000"} size={80} />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            <ImageCarousel images={postDescription?.images} />
          </div>
          <div className="p-6">
            <PostHeader postDescription={postDescription} auth={auth} />
            <PostDescriptionBox description={postDescription?.description} />
            {auth?.role === SUPER_ADMIN ? (
              <AdminActions
                postDescription={postDescription}
                handleChangePostStatus={handleChangePostStatus}
                handleVideoClick={handleVideoClick}
                isVideoVisible={isVideoVisible}
              />
            ) : (
              <UserActions
                auth={auth}
                postDescription={postDescription}
                handleSendMessage={handleSendMessage}
                handleCancelExchangeRequest={handleCancelExchangeRequest}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDescriptionScreen;