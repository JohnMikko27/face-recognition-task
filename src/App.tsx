/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import * as faceapi from "face-api.js"
// import useAnimationFrame from "use-animation-frame"

export default function App() {
  const canvasRef = useRef<any>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream>()

  const handleDetection = async() => {
    if (videoRef.current && videoRef.current instanceof HTMLVideoElement) {
      const detections = await faceapi.detectAllFaces(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })
      ).withFaceLandmarks().withAgeAndGender().withFaceExpressions()
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      const displaySize = {
        width: videoRef.current.clientWidth,
        height: videoRef.current.clientHeight
      };
      faceapi.matchDimensions(canvasRef.current, displaySize)
      const resized = faceapi.resizeResults(detections, displaySize)

      faceapi.draw.drawDetections(canvasRef.current, resized)
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
    } 
    requestAnimationFrame(handleDetection)
  }
  
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };
    startWebcam();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const loadModels = async() => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models")
        ]);
        handleDetection()
      } catch (e) {
        console.error("Error loading models:", e);
      }
    }
    if (videoRef.current) {
      loadModels();
    }
  }, [])
  // useAnimationFrame(handleDetection)
  
  return (
    <div className="h-screen w-screen flex justify-center items-center relative">
      <video autoPlay muted ref={videoRef}
        className="w-full h-auto max-w-[720px] max-h-[560px]"></video>
      <canvas ref={canvasRef} className="absolute w-full h-auto max-w-[720px] max-h-[560px]"></canvas>
    </div>
  )
}