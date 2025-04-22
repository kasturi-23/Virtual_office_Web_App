import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';

function InitiatedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
    const peerRef = useRef();
    const [remoteStreams, setRemoteStreams] = useState([]);

    const createPeer = useCallback((othersSocketId, mySocketId, myStream, webrtcSocket) => {
        const peer = new Peer({
            initiator: true,
            stream: myStream,
            trickle: false,
        });

        peer.on('signal', signal => {
            webrtcSocket.emit('sendOffer', {
                callToUserSocketId: othersSocketId,
                callFromUserSocketId: mySocketId,
                offerSignal: signal
            });
        });

        peer.on('stream', (stream) => {
            setRemoteStreams(prev => [...prev, stream]);
        });

        return peer;
    }, []);
    
    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySocketId, myStream, webrtcSocket);

        webrtcSocket.on('receiveAnswer', ({ callFromUserSocketId, answerSignal }) => {
            if (callFromUserSocketId === othersSocketId && peerRef.current) {
                console.log("Received answer from:", callFromUserSocketId);
                peerRef.current.signal(answerSignal);
            }
        });

        return () => {
            webrtcSocket.off('receiveAnswer');
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, [mySocketId, myStream, othersSocketId, webrtcSocket, createPeer]);

    return (
        <>
            {remoteStreams.map((stream, index) => (
                <video
                    key={index}
                    width="200px"
                    ref={videoNode => videoNode && (videoNode.srcObject = stream)}
                    autoPlay
                    className="remote-video"
                />
            ))}
        </>
    );
}

export default InitiatedVideoCall;
