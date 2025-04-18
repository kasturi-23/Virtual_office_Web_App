import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import GameLoop from './components/GameLoop';
import Office from './components/Office';
import VideoCalls from './components/VideoCalls';
import './App.css';

const WEBRTC_SOCKET = io('http://localhost:8080');

function App() {
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => setSocketConnected(true);
    WEBRTC_SOCKET.on('connect', handleConnect);

    return () => {
      WEBRTC_SOCKET.off('connect', handleConnect);
    };
  }, []);

  return (
    <>
      <header>
        {/* Add any branding or nav here if needed */}
      </header>

      {socketConnected && (
        <main className="content">
          <GameLoop>
            <Office webrtcSocket={WEBRTC_SOCKET} />
          </GameLoop>
          <VideoCalls webrtcSocket={WEBRTC_SOCKET} />
        </main>
      )}

      <footer>
        {/* Footer content can go here */}
      </footer>
    </>
  );
}

export default App;
