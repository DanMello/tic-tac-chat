import { useState, useEffect } from 'react';

export default function useWebSocket(initialState) {
  const [socket, setSocket] = useState(initialState);
  useEffect(() => {
    const s = new WebSocket('ws://localhost:3002/');
    function open () {
      setSocket(s);
    };
    s.addEventListener('open', open);
  }, [])
  return {
    socket
  };
}