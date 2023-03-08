import React, { useEffect, useState } from 'react';

const OpenCVWrapper = ({ children }) => {
  const [cv, setCv] = useState(null);

  useEffect(() => {
    const loadScript = async () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'path/to/opencv.js';
      script.async = true;
      script.onload = () => setCv(window.cv);
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  return <>{cv && children(cv)}</>;
};

export default OpenCVWrapper;
