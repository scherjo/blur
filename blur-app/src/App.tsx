import { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import appStyle from './App.style.js';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const APP_URL = 'wss://blur-app.fly.dev/blur_ws';
const TIME_BETWEEN_FRAMES_MS = 200;
const SCORE_THRESHOLD = 0.5;

function App() {
  const webcamRef = useRef<any>(null);
  const [processedImage, setProcessedImage] = useState<any>(null);
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(APP_URL, {
    shouldReconnect: () => true,
    reconnectInterval: 1,
  });

  useEffect(() => {
    if (lastMessage) {
      setProcessedImage(lastMessage.data);
    }
  }, [lastMessage, setProcessedImage]);

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc && readyState === ReadyState.OPEN) {
        sendJsonMessage({image: imageSrc, score_threshold: SCORE_THRESHOLD});
      }
    }
  }, [readyState, sendJsonMessage]); 

  useEffect(() => {
    const intervalId = setInterval(captureImage, TIME_BETWEEN_FRAMES_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [captureImage]);

  return (
    <div
      // @ts-ignore
      style={appStyle.background}>
      <h1 style={appStyle.title}>Real-time AI Face Blurring</h1>
      <Webcam
        // @ts-ignore
        style={appStyle.hidden}
        ref={webcamRef}
        mirrored={true}
        audio={false}
        screenshotFormat='image/jpeg'
        screenshotQuality={0.5}
      />
      <div
        // @ts-ignore
        style={appStyle.flexboxRow}>
        {processedImage &&
        <img
          style={appStyle.shadow}
          src={`data:image/jpeg;base64,${processedImage}`}
          alt='Processed'
        />}
      </div>
    </div>
  );
}

export default App;
