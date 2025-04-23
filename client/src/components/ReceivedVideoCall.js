import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';

function ReceivedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket, offerSignal }) {
    const peerRef = useRef();
    const videoRef = useRef(null); // Ref for the video element
    const [remoteStream, setRemoteStream] = useState(null);

    const createPeer = useCallback(() => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: myStream,
        });

        peer.on('signal', signal => {
            webrtcSocket.emit('sendAnswer', {
                callFromUserSocketId: mySocketId,
                callToUserSocketId: othersSocketId,
                answerSignal: signal
            });
        });

        peer.on('stream', (stream) => {
            setRemoteStream(stream);
        });

        peer.signal(offerSignal);
        return peer;
    }, [mySocketId, myStream, othersSocketId, offerSignal, webrtcSocket]);

    useEffect(() => {
        peerRef.current = createPeer();

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, [createPeer]);

    useEffect(() => {
        if (videoRef.current && remoteStream) {
            videoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <>
            {remoteStream && (
                <video
                    ref={videoRef}
                    width="200px"
                    autoPlay
                    playsInline
                    className="remote-video"
                />
            )}
        </>
    );
}

export default ReceivedVideoCall;
