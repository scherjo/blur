import React, { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [processedImage, setProcessedImage] = useState<any>(null);
  
  const TIME_BETWEEN_FRAMES_MS = 100;

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      
      axios.post("http://localhost:5001/upload", {
      image: imageSrc,
    })
      .then((response) => {
        setProcessedImage(response.data.img);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, []); 

  useEffect(() => {
    const intervalId = setInterval(captureImage, TIME_BETWEEN_FRAMES_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [captureImage]);

  return (
    <div>
      <h2>Real-time Face Blurring</h2>
      <Webcam
        ref={webcamRef}
      />
      {processedImage && <img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed" />}
    </div>
  );
}

export default App;
