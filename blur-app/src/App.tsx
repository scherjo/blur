import React, { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [processedImage, setProcessedImage] = useState<any>(null);
  const [lastTimestamp, setLastTimestamp] = useState<any>(0);
  
  const TIME_BETWEEN_FRAMES_MS = 500;
  
  const captureImage = useCallback((timestamp: number) => {
    console.log(timestamp);
    
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc && timestamp - lastTimestamp >= TIME_BETWEEN_FRAMES_MS) {
        console.log('calling');
        
        axios.post("http://localhost:5001/upload", {
        image: imageSrc,
      })
        .then((response) => {
          setProcessedImage(response.data.img);
          setLastTimestamp(timestamp);
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }
    requestAnimationFrame(captureImage);
  }, [lastTimestamp]); 

  useEffect(() => {
    requestAnimationFrame(captureImage);
  }, [captureImage]);

  return (
    <div>
      <h2>Real-time Face Blurring</h2>
      <Webcam
        ref={webcamRef}
      />
      {/* <button onClick={captureImage}>Capture Image</button> */}
      {processedImage && <img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed" />}
    </div>
  );
}

export default App;
