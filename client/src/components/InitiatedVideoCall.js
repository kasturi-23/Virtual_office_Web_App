import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';

function InitiatedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket }) {
    const peerRef = useRef();
    const videoRefs = useRef([]); // array of refs for multiple remote streams
    const [remoteStreams, setRemoteStreams] = useState([]);

    const createPeer = useCallback(() => {
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
    }, [mySocketId, myStream, othersSocketId, webrtcSocket]);

    useEffect(() => {
        peerRef.current = createPeer();

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
    }, [createPeer, othersSocketId, webrtcSocket]);

    useEffect(() => {
        // Set srcObject after DOM updates
        remoteStreams.forEach((stream, index) => {
            if (videoRefs.current[index]) {
                videoRefs.current[index].srcObject = stream;
            }
        });
    }, [remoteStreams]);

    return (
        <>
            {remoteStreams.map((_, index) => (
                <video
                    key={index}
                    ref={el => (videoRefs.current[index] = el)}
                    width="200px"
                    autoPlay
                    playsInline
                    className="remote-video"
                />
            ))}
        </>
    );
}

export default InitiatedVideoCall;
