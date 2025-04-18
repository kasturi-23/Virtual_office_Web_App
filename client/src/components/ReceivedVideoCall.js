import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';

function ReceivedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket, offerSignal }) {
  const peerRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Create a peer connection to handle an incoming call
  const createPeerConnection = useCallback(() => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myStream,
    });

    // Emit answer signal after receiving offer
    peer.on('signal', (signal) => {
      webrtcSocket.emit('sendAnswer', {
        callFromUserSocketId: othersSocketId,
        callToUserSocketId: mySocketId,
        answerSignal: signal,
      });
    });

    // Handle receiving the remote stream
    peer.on('stream', (incomingStream) => {
      setRemoteStream(incomingStream);
    });

    // Signal the peer with the offer from the caller
    peer.signal(offerSignal);

    return peer;
  }, [myStream, mySocketId, othersSocketId, webrtcSocket, offerSignal]);

  useEffect(() => {
    peerRef.current = createPeerConnection();

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [createPeerConnection]);

  // Attach remote stream to the video element
  const attachStreamToVideo = (videoEl) => {
    if (videoEl && remoteStream) {
      videoEl.srcObject = remoteStream;
    }
  };

  return (
    <div className="received-video-container">
      {remoteStream && (
        <video
          width="200"
          autoPlay
          playsInline
          className="remote-video"
          ref={attachStreamToVideo}
        />
      )}
    </div>
  );
}

export default ReceivedVideoCall;
