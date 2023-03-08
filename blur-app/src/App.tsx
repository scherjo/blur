import React, { useEffect, useState } from 'react';
import cv from "@techstark/opencv-js";
import { loadHaarFaceModels, detectHaarFace } from "./detectFace";
import './App.css';
import { OpenCvProvider } from 'opencv-react';
import BlurPage from './BlurPage';

function App() {


  return (
    <OpenCvProvider>
      <BlurPage />
    </OpenCvProvider>
  );
}

export default App;
