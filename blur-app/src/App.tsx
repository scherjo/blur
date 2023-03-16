import { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import appStyle from './App.style.js';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Slider, Skeleton, Typography } from '@mui/material';

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
      <h1 style={appStyle.title}>Real-time Face Blurring</h1>
      <h4 style={appStyle.subtitle}>Adrien Delepine, Jordan Scher</h4>
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
        {processedImage ?
        (<div>
          <img
            style={{...appStyle.shadow, ...appStyle.video}}
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
            valueLabelFormat={(val) => `Confidence threshold: ${val}`}
            getAriaValueText={(val) => `${val}`}
            valueLabelDisplay="auto"
            step={0.01}
            min={0}
            max={1}
          />
        </div>) : (
          <Skeleton variant="rectangular" width={210} height={118} />
        )
        }
      </div>
      <div
        // @ts-ignore
        style={appStyle.flexboxRow}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/IIJsA7DjSEY"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        >
        </iframe>
      </div>
      <div style={appStyle.fullWidth}>
        <div
          // @ts-ignore
          style={appStyle.centered}>
          <h2 style={appStyle.sectionTitle}>Problem Description:</h2>
          <p style={appStyle.paragraph}>
            It’s common to see images and videos where faces need to be blurred, from footage captured in a public place to respect general privacy, to interviews where anonymity is required, to Google Street View images containing people. However, the process of blurring faces manually, especially in videos with constant movement, can be tedious. We set out to create a tool for blurring faces in images and videos automatically, with the goal being that it would be efficient and accurate enough to be practical and useful in these real-world applications.
          </p>

          <h2 style={appStyle.sectionTitle}>Previous Work:</h2>
          <p style={appStyle.paragraph}>
            Using OpenCV, we tried out multiple face detection methods, narrowing it down to two high-performing options: Haar Feature-Based Cascade Classifier and YuNet (both provided by OpenCV).
          </p>

          <h2 style={appStyle.sectionTitle}>Approach:</h2>
          <p style={appStyle.paragraph}>
            Using the WIDER FACE dataset, we evaluated the accuracy of the two models (using the somewhat crude but good enough metric of the number of faces detected), determining that YuNet performed better on general face detection, and much better on partially occluded and rotated faces, as well as faces from different perspectives and under different lighting conditions. As a bonus, YuNet also seemed to be much more efficient, performing the face detection 3-6 times faster than the Haar Cascade Classifier.
          </p>
          <p style={appStyle.paragraph}>
            Once we settled on YuNet, we tuned the parameters using a random search over the confidence and non-max suppression thresholds to determine which configurations led to the correct number of faces being detected. Once we started using video, we readjusted the confidence threshold manually (through trial and error) to determine a value that would consistently blur all faces across all frames without too many false positives; we prioritized blurring all faces over reducing the false positives, since a face-blurring tool where a blurred face becomes clear for even a few frames wouldn’t be very useful.
          </p>
          <p style={appStyle.paragraph}>
            Once we felt confident in our model’s ability to detect faces, we set out on building our website. To demonstrate the tool, we wanted to incorporate a live webcam feed on the site, to perform real-time face blurring on the user. This meant that our backend would have to take in one frame at a time, process the image, and send it back to the front end with the blur applied. We decided on React for the frontend and Flask for the backend (since our OpenCV code was already written in Python).
          </p>

          <h2 style={appStyle.sectionTitle}>Challenges:</h2>
          <p style={appStyle.paragraph}>
            Initially, we wanted to use OpenCV.js, since we thought it would be simple if it could run in the browser and not have to use a backend. However, after trying to get it working for a while, we found that OpenCV.js it was overly complicated to use, and missing some functionality that we needed. That's when we decided to move forward with the Flask backend.
          </p>
          <p style={appStyle.paragraph}>
            We also ran into challenges of efficiency, since the constant transfer of images was overwhelming the backend and causing latency on the order of several seconds after running the app for a short period of time. To fix this, we ended up using web sockets, which allowed us to cut down on the latency and maintain a smoother, truly real-time video feed.
          </p>

          <h2 style={appStyle.sectionTitle}>Reflection:</h2>
          <p style={appStyle.paragraph}>
            Overall, this project presented challenges with both configuring an accurate and efficient neural network for face detection and with running reliable communication between a frontend and backend.
          </p>
          <p style={appStyle.paragraph}>
            As next steps, we would like to add the ability to upload a video file to the website and get back the blurred video, since this would be more convenient for users than the Python blurring tool. We'd also like to make the blurring more configurable. For example, giving the user the option to only blur people's eyes, or even select certain people to be blurred.
          </p>
          <p style={appStyle.paragraph}>
            Our approach combined two concepts we learned about in class: a convolutional neural network for face detection and a box filter for blurring. By taking the time to evaluate different model parameter configurations, we were able to find parameters that allowed for high performance in terms of speed and accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
