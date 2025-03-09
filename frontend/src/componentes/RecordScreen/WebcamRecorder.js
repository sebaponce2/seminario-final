import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

const WebcamRecorder = ({ onVideoRecorded }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleSaveAsBase64 = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        onVideoRecorded(reader.result);
        setRecordedChunks([]);
      };
      reader.readAsDataURL(blob);
    }
  }, [recordedChunks, onVideoRecorded]);

  return (
    <div className="space-y-4">
      <Webcam audio={false} ref={webcamRef} className="w-full rounded-lg" />
      {capturing ? (
        <button
          onClick={handleStopCaptureClick}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Detener Grabación
        </button>
      ) : (
        <button
          onClick={handleStartCaptureClick}
          className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Iniciar Grabación
        </button>
      )}
      {recordedChunks.length > 0 && (
        <button
          onClick={handleSaveAsBase64}
          className="w-full px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
        >
          Ver Video Grabado
        </button>
      )}
    </div>
  );
};

export default WebcamRecorder;
