import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ref, onValue } from '../firebase/firebase';
import { firebaseDatabase } from './Firebase';
import { update as updateAllCharactersData } from './slices/allCharactersSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';

const FirebaseListener = ({ 
  updateAllCharactersData, 
  webrtcSocket 
}) => {
  useEffect(() => {
    // Check if WebRTC socket is available
    if (!webrtcSocket || !webrtcSocket.id) {
      console.warn("WebRTC socket not available");
      return;
    }

    // Reference to the characters node in Firebase
    const charactersRef = ref(firebaseDatabase, 'characters');

    // Listen for changes in characters data
    const unsubscribe = onValue(charactersRef, (snapshot) => {
      const charactersData = snapshot.val() || {};
      
      // If no characters exist, initialize with current user
      if (Object.keys(charactersData).length === 0) {
        const myInitData = {
          ...MY_CHARACTER_INIT_CONFIG,
          socketId: webrtcSocket.id,
          position: { x: 5, y: 5 }
        };
        charactersData[MY_CHARACTER_INIT_CONFIG.id] = myInitData;
      }

      // Update Redux store with characters data
      updateAllCharactersData(charactersData);
    }, (error) => {
      console.error("Firebase listener error:", error);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [webrtcSocket, updateAllCharactersData]);

  return null;
};

const mapDispatchToProps = {
  updateAllCharactersData
};

export default connect(null, mapDispatchToProps)(FirebaseListener);