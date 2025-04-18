import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';

function InitiatedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
  const peerRef = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  // Create a peer connection as the initiator
  const createPeerConnection = useCallback(() => {
    const peer = new Peer({
      initiator: true,
      stream: myStream,
      trickle: false,
    });

    // Emit offer to the remote user via socket
    peer.on('signal', (signal) => {
      webrtcSocket.emit('sendOffer', {
        callToUserSocketId: othersSocketId,
        callFromUserSocketId: mySocketId,
        offerSignal: signal,
      });
    });

    // Handle receiving remote stream
    peer.on('stream', (remoteStream) => {
      setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
    });

    return peer;
  }, [myStream, mySocketId, othersSocketId, webrtcSocket]);

  useEffect(() => {
    // Create and store peer connection
    peerRef.current = createPeerConnection();

    // Listen for answer signal from callee
    const handleReceiveAnswer = ({ callFromUserSocketId, answerSignal }) => {
      if (callFromUserSocketId === othersSocketId && peerRef.current) {
        console.log("Received answer from:", callFromUserSocketId);
        peerRef.current.signal(answerSignal);
      }
    };

    webrtcSocket.on('receiveAnswer', handleReceiveAnswer);

    // Cleanup on component unmount
    return () => {
      webrtcSocket.off('receiveAnswer', handleReceiveAnswer);
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [createPeerConnection, othersSocketId, webrtcSocket]);

  return (
    <>
      {remoteStreams.map((stream, index) => (
        <video
          key={index}
          width="200"
          autoPlay
          className="remote-video"
          ref={(videoEl) => {
            if (videoEl) videoEl.srcObject = stream;
          }}
        />
      ))}
    </>
  );
}

export default InitiatedVideoCall;
