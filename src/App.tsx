/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import CustomWebcam from "./components/customwebcam"
import * as faceapi from "face-api.js"

export default function App() {
  const [images, setImages] = useState<any[]>([]);
  const webcamRef = useRef<any>()
  const canvasRef = useRef<any>()

  const handleDetection = async() => {
    console.log("here")
    const detections = await faceapi.detectAllFaces(
      webcamRef.current, 
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withAgeAndGender().withFaceExpressions()
    console.log(detections)
  }

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/src/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/src/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/src/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/src/models")
      ])
        .then(handleDetection)
        .catch((e) => {
          console.log(`Error loading model: ${e}`)
        })
    }
    if (webcamRef.current) {
      loadModels();
    }
  }, [])
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {/* <CustomWebcam webcamRef={webcamRef} images={images} setImages={setImages}/> */}
      <img 
        src="src/assets/pic-of-myself-in-prom.PNG" 
        alt="example pic" 
        className="w-1/6 h-auto"
        ref={webcamRef}
      />
      <canvas ref={canvasRef}
      className=" absolute "></canvas>
    </div>
  )
}