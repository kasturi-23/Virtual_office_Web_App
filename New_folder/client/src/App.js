import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import GameLoop from './components/GameLoop';
import Office from './components/Office';
import './App.css';

const WEBRTC_SOCKET = io('http://localhost:8080');

function App() {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => setSocketConnected(true);
    WEBRTC_SOCKET.on('connect', handleConnect);

    return () => {
      WEBRTC_SOCKET.off('connect', handleConnect); // Clean up listener
    };
  }, []);

  return (
    <>
      <header></header>
      {socketConnected && (
        <main className="content">
          <GameLoop webrtcSocket={WEBRTC_SOCKET}>
            <Office webrtcSocket={WEBRTC_SOCKET} />
          </GameLoop>
        </main>
      )}
      <footer></footer>
    </>
  );
}

export default App;
