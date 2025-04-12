import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';

import CanvasContext from './CanvasContext';
import { CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP } from './characterConstants';
import { TILE_SIZE } from './mapConstants';
import { loadCharacter } from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { update as updateAllCharactersData } from './slices/allCharactersSlice'
import { onValue, ref, set } from "firebase/database";

import { firebaseDatabase } from '../firebase/firebase';


function MyCharacter({ myCharactersData, loadCharacter, updateAllCharactersData, webrtcSocket }) {
    const context = useContext(CanvasContext);
    useEffect(() => {
        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
        };

        const users = {};
        const myId = MY_CHARACTER_INIT_CONFIG.id;
        users[myId] = myInitData;
        set(ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id), myInitData);
    }, [webrtcSocket]);

    useEffect(() => {
        const usersRef = ref(firebaseDatabase, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                updateAllCharactersData(data); // Updating Redux slice
            }
        });
    }, [updateAllCharactersData]);

    useEffect(() => {
        if (context == null || myCharactersData == null) {
            return;
        }
        const characterImg = document.querySelector(`#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`);
        const { sx, sy } = CHARACTER_CLASSES_MAP[MY_CHARACTER_INIT_CONFIG.characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            myCharactersData.position.x * TILE_SIZE,
            myCharactersData.position.y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );
        loadCharacter(true);
    }, [context, myCharactersData?.position.x, myCharactersData?.position.y, loadCharacter]);

    return null;
}

const mapStateToProps = (state) => {
    return { myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id] };
};

const mapDispatch = { loadCharacter, updateAllCharactersData };

export default connect(mapStateToProps, mapDispatch)(MyCharacter);