/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function CustomWebcam({ webcamRef }: { webcamRef: any}) {
  
  const [imgSrc, setImgSrc] = useState<any[]>([]);

  const capture = useCallback(() => {
    const newImage = webcamRef.current.getScreenshot();
    setImgSrc([...imgSrc, newImage]);

  }, [webcamRef]);

  return (
    <div className="">
      <Webcam height={600} width={600} ref={webcamRef} className="border-2 border-black border-solid"/>
      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
      </div>
      { imgSrc.length !== 0 && imgSrc.map((image) => {
        return <img src={image}/>
      })}
    </div>
  );
};
