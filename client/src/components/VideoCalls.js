import React, { useEffect, useState } from 'react';
import MyVideo from './MyVideo';
import InitiatedVideoCall from './InitiatedVideoCall';
import ReceivedVideoCall from './ReceivedVideoCall';
import { connect } from 'react-redux';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';

function VideoCalls({ myCharacterData, otherCharactersData, webrtcSocket }) {
    const [myStream, setMyStream] = useState();
    const [offersReceived, set0ffersReceived] = useState({});

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setMyStream(stream);
            })
            .catch(err => {
                console.error("Error accessing media devices:", err);
            });
    }, []);

    useEffect(() => {
        const handleReceiveOffer = (payload) => {
            set0ffersReceived(prevOffers => {
                if (!Object.keys(prevOffers).includes(payload.callFromUserSocketId)) {
                    console.log("received offer from", payload.callFromUserSocketId, "with payload:", payload);
                    return { ...prevOffers, [payload.callFromUserSocketId]: payload.offerSignal };
                }
                return prevOffers;
            });
        };

        webrtcSocket.on("receiveOffer", handleReceiveOffer);

        // Clean up the listener on unmount:
        return () => {
            webrtcSocket.off("receiveOffer", handleReceiveOffer);
        };
    }, [webrtcSocket]);


    // Only proceed if we have a socket ID
    if (!myCharacterData?.socketId) {
        return <div>Waiting for socket connection...</div>;
    }

    const myUserId = myCharacterData?.id;
    // Filter users to initiate calls to 
    const initiateCallToUsers = Object.keys(otherCharactersData)
        .filter((othersUserId) => othersUserId > myUserId && otherCharactersData[othersUserId].socketId)
        .reduce((filteredObj, key) => {
            filteredObj[key] = otherCharactersData[key];
            return filteredObj;
        }, {});



    console.log("My socket ID:", myCharacterData.socketId);
    console.log("Initiating calls to:", Object.keys(initiateCallToUsers).map(id => otherCharactersData[id].socketId));

    return <>{
        myCharacterData && <div className="videos">
            <MyVideo myStream={myStream} />

            {/* Initiated calls */}
            {Object.keys(initiateCallToUsers).map((othersUserId) => {
                return <InitiatedVideoCall
                    key={initiateCallToUsers[othersUserId].socketId}
                    mySocketId={myCharacterData.socketId}
                    myStream={myStream}
                    othersSocketId={initiateCallToUsers[othersUserId].socketId}
                    webrtcSocket={webrtcSocket}
                />
            })}

            {Object.keys(offersReceived).map((othersSocketId) => {
                const matchingUserIds = Object.keys(otherCharactersData)
                    .filter((otherUserId) => otherCharactersData[otherUserId].socketId === othersSocketId)
                console.assert(
                    matchingUserIds.length === 1,
                    "Unexpected list of matching user ids",
                    matchingUserIds
                )
                return <ReceivedVideoCall
                    key={othersSocketId}
                    mySocketId={myCharacterData.socketId}
                    myStream={myStream}
                    othersSocketId={othersSocketId}
                    webrtcSocket={webrtcSocket}
                    offerSignal={offersReceived[othersSocketId]} />
            })}
        </div>
    }</>;
}

const mapStateToProps = (state) => {
    const myCharacterData = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
    const otherCharactersData = Object.keys(state.allCharacters.users)
        .filter(id => id != MY_CHARACTER_INIT_CONFIG.id)
        .reduce((filteredObj, key) => {
            filteredObj[key] = state.allCharacters.users[key];
            return filteredObj;
        }, {});
    return { myCharacterData: myCharacterData, otherCharactersData: otherCharactersData };
};

export default connect(mapStateToProps, {})(VideoCalls);