import VideoPreview from "../../componentes/RecordScreen/VideoPreview";
import WebcamRecorder from "../../componentes/RecordScreen/WebcamRecorder";
import { SuccessPostModal } from "../../componentes/SuccessPostModal/index";
import useVideoRecording from "../../hooks/useVideoRecording";

export const RecordScreen = () => {
  const {
    bodyPost,
    isSubmitted,
    handleVideoRecorded,
    handleRecordAgain,
    handleSubmit,
  } = useVideoRecording();

  return isSubmitted ? (
    <SuccessPostModal />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E7EA]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Grabar Video
        </h1>
        <p className="mb-6 text-center text-gray-700">
          A continuación, se te solicitará que grabes un video mostrando el bien
          a publicar. Esto con el objetivo de validar que el bien es real.
        </p>

        {bodyPost?.video ? (
          <VideoPreview
            videoSrc={bodyPost.video}
            onRecordAgain={handleRecordAgain}
            onSubmit={handleSubmit}
          />
        ) : (
          <WebcamRecorder onVideoRecorded={handleVideoRecorded} />
        )}
      </div>
    </div>
  );
};
