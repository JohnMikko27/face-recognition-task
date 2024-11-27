/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import CustomWebcam from "./components/customwebcam"
import * as faceapi from "face-api.js"
import Webcam from "react-webcam";

export default function App() {
  const canvasRef = useRef<any>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<any>()

  const handleDetection = async() => {
    if (videoRef.current && videoRef.current instanceof HTMLVideoElement) {
      console.log("here1")
      const detections = await faceapi.detectAllFaces(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })
      ).withFaceLandmarks().withAgeAndGender().withFaceExpressions()
      console.log("detections:")
      console.log(detections)

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
      faceapi.matchDimensions(canvasRef.current, {
        width: 720,
        height: 560
      })
      const resized = faceapi.resizeResults(detections, {
        width: 720,
        height: 560
      })

      faceapi.draw.drawDetections(canvasRef.current, resized)
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
    } 
    // setInterval(() => handleDetection())
  }
  
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          console.log("ok")
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        console.log("ok")
        stream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const loadModels = async() => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/src/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/src/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/src/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/src/models")
        ]);
        console.log("Models loaded successfully");
        // handleDetection();
      } catch (e) {
        console.error("Error loading models:", e);
      }
    }
    if (videoRef.current) {
      loadModels();
    }

  }, [])

  
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <video autoPlay muted ref={videoRef} onPlay={handleDetection}
      className="w-[720px] h-[560px]"></video>
      <canvas ref={canvasRef}
      className=" absolute w-[720px] h-[560px]"></canvas>
    </div>
  )
}