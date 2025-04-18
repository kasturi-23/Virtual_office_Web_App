import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MyVideo from './MyVideo';
import InitiatedVideoCall from './InitiatedVideoCall';
import ReceivedVideoCall from './ReceivedVideoCall';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';

function VideoCalls({ myCharacterData, otherCharactersData, webrtcSocket }) {
  const [myStream, setMyStream] = useState(null);
  const [offersReceived, setOffersReceived] = useState({});

  // Get access to webcam/microphone
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => setMyStream(stream))
      .catch(err => console.error("Error accessing media devices:", err));
  }, []);

  // Handle incoming offers
  useEffect(() => {
    const handleOffer = (payload) => {
      const { callFromUserSocketId, offerSignal } = payload;
      console.log("Received offer from", callFromUserSocketId, "Payload:", payload);

      if (!offersReceived[callFromUserSocketId]) {
        setOffersReceived(prev => ({
          ...prev,
          [callFromUserSocketId]: offerSignal,
        }));
      }
    };

    webrtcSocket.on("receiveOffer", handleOffer);

    return () => {
      webrtcSocket.off("receiveOffer", handleOffer);
    };
  }, [offersReceived, webrtcSocket]);

  // Don't proceed until socket ID is assigned
  if (!myCharacterData?.socketId) {
    return <div>Waiting for socket connection...</div>;
  }

  const myUserId = myCharacterData.id;

  // Determine which users to initiate calls to
  const initiateCallToUsers = Object.entries(otherCharactersData)
    .filter(([userId, data]) => userId > myUserId && data.socketId)
    .reduce((result, [key, val]) => {
      result[key] = val;
      return result;
    }, {});

  console.log("My socket ID:", myCharacterData.socketId);
  console.log("Initiating calls to:", Object.keys(initiateCallToUsers).map(id => initiateCallToUsers[id].socketId));

  return (
    <div className="videos">
      {/* Local video */}
      <MyVideo myStream={myStream} />

      {/* Outgoing calls */}
      {Object.keys(initiateCallToUsers).map(userId => (
        <InitiatedVideoCall
          key={initiateCallToUsers[userId].socketId}
          mySocketId={myCharacterData.socketId}
          myStream={myStream}
          othersSocketId={initiateCallToUsers[userId].socketId}
          webrtcSocket={webrtcSocket}
        />
      ))}

      {/* Incoming calls */}
      {Object.keys(offersReceived).map(othersSocketId => {
        const matchingUserIds = Object.keys(otherCharactersData)
          .filter(userId => otherCharactersData[userId].socketId === othersSocketId);

        console.assert(
          matchingUserIds.length === 1,
          "Unexpected list of matching user ids",
          matchingUserIds
        );

        return (
          <ReceivedVideoCall
            key={othersSocketId}
            mySocketId={myCharacterData.socketId}
            myStream={myStream}
            othersSocketId={othersSocketId}
            webrtcSocket={webrtcSocket}
            offerSignal={offersReceived[othersSocketId]}
          />
        );
      })}
    </div>
  );
}

const mapStateToProps = (state) => {
  const myCharacterData = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
  const otherCharactersData = Object.entries(state.allCharacters.users)
    .filter(([id]) => id !== MY_CHARACTER_INIT_CONFIG.id)
    .reduce((result, [id, user]) => {
      result[id] = user;
      return result;
    }, {});

  return {
    myCharacterData,
    otherCharactersData,
  };
};

export default connect(mapStateToProps)(VideoCalls);
