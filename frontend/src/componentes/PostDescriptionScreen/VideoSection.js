"use client";

const VideoSection = ({ video, isVideoVisible, handleVideoClick }) => {
  return (
    <div className="sm:flex-row gap-4">
      <button
        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300"
        onClick={handleVideoClick}
      >
        {isVideoVisible ? "Cerrar video" : "Visualizar video"}
      </button>
      {isVideoVisible && video && (
        <div className="mt-4">
          <video
            controls
            className="w-full"
            src={video}
            alt="Video de publicación"
          />
        </div>
      )}
    </div>
  );
};

export default VideoSection;
