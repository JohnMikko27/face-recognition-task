/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import Webcam from "react-webcam";

export default function CustomWebcam({ webcamRef, images, setImages }
    : { webcamRef: any, images: any[], setImages: any}) {

  const capture = useCallback(() => {
    const newImage = webcamRef.current.getScreenshot();
    setImages([...images, newImage]);

  }, [webcamRef]);

  return (
    <div className="h-full overflow-y-scroll">
      <Webcam height={600} width={600} ref={webcamRef} className="border-2 border-black border-solid"/>
      <video ref={webcamRef} autoPlay></video>
      <div className="">
        <button onClick={capture}>Capture photo</button>
      </div>
      { images.length !== 0 && images.map((image: any) => {
        return <img src={image} alt="Webcam Images"/>
      })}
    </div>
  );
};
