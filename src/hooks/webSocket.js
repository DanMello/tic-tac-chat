import { useState, useEffect } from 'react';

export default function useWebSocket({config}) {

  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url;
    if (config.environment === 'development') {
      url = 'ws://localhost:3003/';
    } else if (config.isMobile) {
      url = 'wss://m.mellocloud.com/ws';
    } else {
      url = 'wss://mellocloud.com/ws';
    };
    const s = new WebSocket(url);
    function open () {
      setSocket(s);
    };
    function error() {
      setError('Failed to connect to server please refresh page.')
    };
    s.addEventListener('open', open);
    s.addEventListener('error', error);
  }, [])
  return {
    socket,
    error
  };
}