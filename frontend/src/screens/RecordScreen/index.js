import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";

export const RecordScreen = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);

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

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const handleRecordAgain = useCallback(() => {
    setVideoUrl(null);
    setRecordedChunks([]);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E7EA]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Grabar Video
        </h1>
        <p className="mb-6 text-center text-gray-700">
          A continuación, se te solicitará que grabes un video mostrando el bien
          a publicar. Esto con el objetivo de validar que el producto es real.
        </p>
        {videoUrl ? (
          <div className="space-y-4">
            <video src={videoUrl} controls className="w-full rounded-lg" />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRecordAgain}
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
              >
                Grabar de nuevo
              </button>
              <Link
                to="/success"
                onClick={() => console.log("Finalizar")}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Finalizar
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              className="w-full rounded-lg"
            />
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
                onClick={handleDownload}
                className="w-full px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
              >
                Ver Video Grabado
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
