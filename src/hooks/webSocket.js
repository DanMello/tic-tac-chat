import { useState, useEffect } from 'react';

export default function useWebSocket(state, dispatch, socketUrl) {

  const [socket, setSocket] = useState(null);
  const [reconnect, setReconnect] = useState(null);
  const [reconnectTimeOut, setReconnectTimeOut] = useState(null);

  useEffect(() => {
    let url = socketUrl
    if (state.clientID) {
      url += `?clientID=${state.clientID}`; 
    };
    let s = new WebSocket(url);
    if (reconnect !== false) {
      setSocket(s);
      if (reconnect === true) {
        s.addEventListener('open', openSocket);
      };
      s.addEventListener('message', createSocketEvents);
      s.addEventListener('close', closeSocket);
      s.addEventListener('error', error);
    };
    return () => {
      s.close();
      s.removeEventListener('open', openSocket);
      s.removeEventListener('message', createSocketEvents);
      s.removeEventListener('close', closeSocket);
      s.removeEventListener('error', error);
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
      dispatch({type: 'RESET_STATE'});
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