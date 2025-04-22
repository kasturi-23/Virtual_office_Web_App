import React, { useEffect, useRef, useCallback, useState } from 'react';
import Peer from 'simple-peer';

function ReceivedVideoCall({ mySocketId, myStream, othersSocketId, webrtcSocket, offerSignal }) {
    const peerRef = useRef();
    const [remoteStream, setRemoteStream] = useState(null);

    const createPeer = useCallback((othersSocketId, mySocketId, myStream, webrtcSocket, offerSignal) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: myStream,
        });

        peer.on('signal', signal => {
            webrtcSocket.emit('sendAnswer', {
                callFromUserSocketId: mySocketId,    // Client 2’s own socket ID
                callToUserSocketId: othersSocketId,   // Client 1’s socket ID (sender of the offer)
                answerSignal: signal
            });
        });
        

        peer.on('stream', (stream) => {
            setRemoteStream(stream);
        });

        peer.signal(offerSignal);
        return peer;
    }, [myStream, webrtcSocket, offerSignal]);

    useEffect(() => {
        peerRef.current = createPeer(othersSocketId, mySocketId, myStream, webrtcSocket, offerSignal);

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, [mySocketId, myStream, othersSocketId, webrtcSocket, offerSignal]);

    const setVideoNode = (videoNode) => {
        if (videoNode && remoteStream) {
            videoNode.srcObject = remoteStream;
        }
    };

    return (
        <>
            {remoteStream && (
                <video
                    width="200px"
                    ref={setVideoNode}
                    autoPlay
                    className="remote-video"
                />
            )}
        </>
    );
}

export default ReceivedVideoCall;
