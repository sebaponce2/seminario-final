import VideoSection from "./VideoSection";

const AdminActions = ({
  postDescription,
  handleChangePostStatus,
  handleVideoClick,
  isVideoVisible,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {postDescription?.type === "Bien" && (
        <VideoSection
          video={postDescription?.video}
          isVideoVisible={isVideoVisible}
          handleVideoClick={handleVideoClick}
        />
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => handleChangePostStatus(true)}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          Aprobar
        </button>
        <button
          onClick={() => handleChangePostStatus(false)}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
};

export default AdminActions;
