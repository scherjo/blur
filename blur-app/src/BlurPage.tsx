import React, { useEffect, useState } from 'react';
import Webcam from "react-webcam";
import { useOpenCv } from 'opencv-react';

const BlurPage = () => {
    const { loaded, cv } = useOpenCv();

    const [modelLoaded, setModelLoaded] = React.useState(false);

    React.useEffect(() => {
      // loadHaarFaceModels().then(() => {
        setModelLoaded(true);
      // });
    }, []);
  
    const webcamRef = React.useRef(null);
    const imgRef = React.useRef(null);
    const faceImgRef = React.useRef(null);
  
    React.useEffect(() => {
      if (!modelLoaded) return;
  
      const detectFace = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;
  
        return new Promise((resolve) => {
          faceImgRef.current.src = imageSrc;
          faceImgRef.current.onload = () => {
            try {
              const img = cv.imread(faceImgRef.current);
              let p1  = new cv.Point(0, 0);
              let p2  = new cv.Point(200, 200);
              cv.line(img, p1, p2, [0, 255, 0, 255], 1)
              cv.imshow(faceImgRef.current, img);
              img.delete();
              resolve();
            } catch (error) {
              console.log(error);
              resolve();
            }
          };
        });
      };
  
      let handle;
      const nextTick = () => {
        handle = requestAnimationFrame(async () => {
          await detectFace();
          nextTick();
        });
      };
      nextTick();
      return () => {
        cancelAnimationFrame(handle);
      };
    }, [modelLoaded]);  

  return (
    <div>
      <h2>Real-time Face Detection</h2>
    <Webcam
      ref={webcamRef}
      className="webcam"
      mirrored
      screenshotFormat="image/jpeg" />
    {/* <img className="inputImage" alt="input" ref={() => {
      // if (loaded) {
      //   const img = cv.imread(imgRef.current);
        
      // }
      return imgRef;
    }} /> */}
    <img className="inputImage" alt="input" ref={imgRef} />
    <canvas className="outputImage" ref={faceImgRef} />
    </div>
  );
};

export default BlurPage;
