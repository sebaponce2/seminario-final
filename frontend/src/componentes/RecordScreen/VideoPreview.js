const VideoPreview = ({ videoSrc, onRecordAgain, onSubmit }) => {
  return (
    <div className="space-y-4">
      <video src={videoSrc} controls className="w-full rounded-lg" />
      <div className="flex justify-center space-x-4">
        <button
          onClick={onRecordAgain}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
        >
          Grabar de nuevo
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;
