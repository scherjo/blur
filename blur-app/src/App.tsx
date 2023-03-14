import { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Style from "./App.module.css";
// @ts-ignore
import styled from 'styled-components';
import useWebSocket, { ReadyState } from 'react-use-websocket';

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
  const webcamRef = useRef<any>(null);
  const [processedImage, setProcessedImage] = useState<any>(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://blur-app.fly.dev/blur_ws', {
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 1,
  });
  
  const TIME_BETWEEN_FRAMES_MS = 100;

  useEffect(() => {
    if (lastMessage) {
      setProcessedImage(lastMessage.data);
    }
  }, [lastMessage, setProcessedImage]);

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc && readyState === ReadyState.OPEN) {
        sendMessage(imageSrc);
      }
    }
  }, [readyState, sendMessage]); 

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
