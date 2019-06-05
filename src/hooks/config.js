import { useState, useEffect } from 'react';

export default function useConfig({configuration}) {

  const [url, setUrl] = useState('');
  const [socketUrl, setSocketUrl] = useState('');
  const {environment, isMobile} = configuration;

  useEffect(() => {
    if (environment === 'development') {
      if (isMobile) {
        setUrl('http://10.0.0.189:3004');
        setSocketUrl('ws://10.0.0.189:3003');
      } else {
        setUrl('http://localhost:3004');
        setSocketUrl('ws://localhost:3003');
      };
    } else if (environment === 'production') {
      setUrl('https://game.mellocloud.com');
      if (isMobile) {
        setSocketUrl('wss://m.mellocloud.com/ws');
      } else {
        setSocketUrl('wss://mellocloud.com/ws');
      };
    };
  }, [])

  return {url, socketUrl, isMobile}
};