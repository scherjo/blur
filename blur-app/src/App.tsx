import React, { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from "axios";
import Style from "./App.module.css";
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const Horizontal = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  font-family: Arial, Helvetica, sans-serif;
`;

function App() {
  const webcamRef = useRef(null);
  const [processedImage, setProcessedImage] = useState<any>(null);
  const socket = new WebSocket('ws://localhost:5001/blur_ws');
  
  const TIME_BETWEEN_FRAMES_MS = 200;
  
  socket.addEventListener('message', ev => {
    // console.log(ev);
    setProcessedImage(ev.data)
  });

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // console.log(imageSrc);
      
      // axios.post("https://blur-app.fly.dev/upload", {
      // axios.post("http://localhost:5001/upload", {
      //   image: imageSrc,
      // })
      //   .then((response) => {
      //     setProcessedImage(response.data.img);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      if (imageSrc != null) {
        socket.send(imageSrc);
      }
    }
  }, []); 

  useEffect(() => {
    const intervalId = setInterval(captureImage, TIME_BETWEEN_FRAMES_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [captureImage]);

  return (
    <Container>
      <Title>Real-time AI Face Blurring</Title>
      <Horizontal>
        {/* <WebcamWrapper> */}
          <Webcam ref={webcamRef} mirrored={true} />
        {/* </WebcamWrapper> */}
          {processedImage && <img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed" />}
      </Horizontal>
    </Container>
  );
}

export default App;
