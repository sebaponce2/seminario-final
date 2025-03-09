import { useState, useCallback, useEffect } from "react";
import { loadFromLocalStorage } from "./useLocaleStorage";
import { createNewPost } from "../services/posts";

const useVideoRecording = () => {
  const [bodyPost, setBodyPost] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    getBodyPost();
  }, []);

  const getBodyPost = async () => {
    const body = await loadFromLocalStorage("savedPost");
    setBodyPost(body);
  };

  const handleVideoRecorded = useCallback((videoBase64) => {
    setBodyPost((prev) => ({
      ...prev,
      video: videoBase64,
    }));
  }, []);

  const handleRecordAgain = useCallback(() => {
    setBodyPost((prev) => ({
      ...prev,
      video: null,
    }));
  }, []);

  const handleSubmit = async () => {
    const { token } = await loadFromLocalStorage("auth");

    try {
      const response = await createNewPost(bodyPost, token);
      if (response) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.log("Error al crear nueva publicación:", error);
    }
  };

  return {
    bodyPost,
    isSubmitted,
    handleVideoRecorded,
    handleRecordAgain,
    handleSubmit,
  };
};

export default useVideoRecording;
