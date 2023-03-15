import { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Style from "./App.module.css";
import useWebSocket, { ReadyState } from 'react-use-websocket';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const appURL = `ws${isSafari ? 's' : ''}://localhost:5001/blur_ws`;  // Safari requires wss, which slows performance

function App() {
  const webcamRef = useRef<any>(null);
  const [processedImage, setProcessedImage] = useState<any>(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(appURL, {
    shouldReconnect: () => true,
    reconnectInterval: 1,
  });
  
  const TIME_BETWEEN_FRAMES_MS = 200;

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
    <div>
      <h1>Real-time AI Face Blurring</h1>
      <Webcam
            className={Style.hidden}
            ref={webcamRef}
            mirrored={true}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.5}
          />
      <div className={Style.flexboxRow}>
          {processedImage && <img src={`data:image/jpeg;base64,${processedImage}`} alt="Processed"/>}
      </div>
    </div>
  );
}

export default App;
