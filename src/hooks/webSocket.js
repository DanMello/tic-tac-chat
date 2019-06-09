import { useState, useEffect } from 'react';

export default function useWebSocket(socketUrl, dispatch) {

  const [socket, setSocket] = useState(null);
  const [reconnect, setReconnect] = useState(null);
  const [reconnectTimeOut, setReconnectTimeOut] = useState(null);

  useEffect(() => {
    if (reconnect === null || reconnect === true) {
      let s = new WebSocket(socketUrl);
      setSocket(s);
      if (reconnect === true) {
        s.addEventListener('open', openSocket);
      }
      s.addEventListener('message', createSocketEvents);
      s.addEventListener('close', closeSocket);
      s.addEventListener('error', error);
    };
  }, [reconnect]);

  function openSocket() {
    dispatch({
      type: 'TOP_BAR_RESPONSE',
      data: {
        type: "MESSAGE",
        message: 'Back online',
      }
    });
    setReconnect(false);
    clearTimeout(reconnectTimeOut);
  };

  function createSocketEvents(event) {
    const data = JSON.parse(event.data);
    dispatch({
      type: data.type,
      data: data
    });
  };

  function closeSocket() {
    dispatch({type: 'RESET_STATE'});
    dispatch({
      type: 'TOP_BAR_RESPONSE',
      data: {
        type: 'ERROR',
        message: 'Lost connection attempting to reconnect.'
      }
    });
    setTimeout(() => {
      setReconnect(true);
    }, 300);
    setReconnectTimeOut(setTimeout(() => {
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: 'ERROR',
          message: 'Failed to reconnect try refreshing page.'
        }
      });
    }, 5000))
  };

  function error() {
    dispatch({
      type: 'TOP_BAR_RESPONSE',
      data: {
        type: 'ERROR',
        message: 'Something went wrong please refresh page.'
      }
    });
  };

  function sendMessage(message) {
    if (socket.readyState === 3) {
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: 'ERROR',
          message: 'No current connection to server, please refresh page.'
        }
      });
      return;
    };
    socket.send(JSON.stringify(message))
  };

  return { sendMessage };
};