import { useEffect, useState, useRef, useCallback } from 'react';
import { Slider } from '@mui/material';
import Webcam from 'react-webcam';
import appStyle from './App.style.js';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const APP_URL = 'wss://blur-app.fly.dev/blur_ws';
const TIME_BETWEEN_FRAMES_MS = 200;

function App() {
  const webcamRef = useRef<any>(null);
  const [processedImage, setProcessedImage] = useState<any>(null);
  const [scoreThreshold, setScoreThreshold] = useState(0.5);
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
        sendJsonMessage({image: imageSrc, score_threshold: scoreThreshold});
      }
    }
  }, [readyState, sendJsonMessage, scoreThreshold]); 

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
        <div>
          <img
            style={appStyle.shadow}
            src={`data:image/jpeg;base64,${processedImage}`}
            alt='Processed'
          />
          <Slider
            aria-label="Face detection threshold"
            value={scoreThreshold}
            onChange={(event, value) => {
              if (typeof value === 'number') {
                setScoreThreshold(value);
              }
            }}
            getAriaValueText={(val) => `${val}`}
            valueLabelDisplay="auto"
            step={0.01}
            min={0}
            max={1}
          />
          </div>
        }
      </div>
    </div>
  );
}

export default App;
