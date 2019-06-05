import { useState, useEffect } from 'react';

export default function useWebSocket(socketUrl) {

  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (socketUrl !== '') {
      const s = new WebSocket(socketUrl);
      function open () {
        setSocket(s);
      };
      function error() {
        setError('Failed to connect to server please refresh page.')
      };
      s.addEventListener('open', open);
      s.addEventListener('error', error);
    };
  }, [socketUrl])
  return {
    socket,
    error
  };
}