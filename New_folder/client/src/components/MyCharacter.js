import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';

import CanvasContext from './CanvasContext';
import { CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP } from './characterConstants';
import { TILE_SIZE } from './mapConstants';
import { loadCharacter } from './slices/statusSlice';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { update as updateAllCharactersData } from './slices/allCharactersSlice';

function MyCharacter({ myCharactersData, loadCharacter, updateAllCharactersData, webrtcSocket }) {
    const context = useContext(CanvasContext);

    
    const initialPosition = myCharactersData?.position || { x: 5, y: 5 };
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        if (!webrtcSocket || !webrtcSocket.id) {
            console.warn(" Socket not available.");
            return;
        }

        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
            position: { x: 5, y: 5 } // Default position
        };

        const users = {};
        users[MY_CHARACTER_INIT_CONFIG.id] = myInitData;
        updateAllCharactersData(users);
    }, [webrtcSocket, updateAllCharactersData]);

    // Handle WASD Movement
    useEffect(() => {
        const handleKeyDown = (event) => {
            setPosition((prev) => {
                let newX = prev.x;
                let newY = prev.y;

                switch (event.key) {
                    case 'w': // Move Up
                        newY = Math.max(prev.y - 1, 0);
                        break;
                    case 's': // Move Down
                        newY = prev.y + 1;
                        break;
                    case 'a': // Move Left
                        newX = Math.max(prev.x - 1, 0);
                        break;
                    case 'd': // Move Right
                        newX = prev.x + 1;
                        break;
                    default:
                        return prev;
                }

                return { x: newX, y: newY };
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    
    useEffect(() => {
        if (!context || !position) {
            console.warn("Canvas context or position is undefined.");
            return;
        }

        const characterImg = document.querySelector(`#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`);
        if (!characterImg) {
            console.warn("Character sprite image not found.");
            return;
        }

        const { sx, sy } = CHARACTER_CLASSES_MAP[MY_CHARACTER_INIT_CONFIG.characterClass].icon;
        context.canvas.drawImage(
            characterImg,
            sx,
            sy,
            CHARACTER_IMAGE_SIZE - 5,
            CHARACTER_IMAGE_SIZE - 5,
            position.x * TILE_SIZE,
            position.y * TILE_SIZE,
            CHARACTER_IMAGE_SIZE,
            CHARACTER_IMAGE_SIZE
        );

        loadCharacter(true);
    }, [context, position.x, position.y, loadCharacter]);

    return null;
}

// Prevent "undefined position" error by setting a default value
const mapStateToProps = (state) => {
    const myCharacter = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
    return { myCharactersData: myCharacter || { position: { x: 5, y: 5 } } };
};

const mapDispatch = { loadCharacter, updateAllCharactersData };

export default connect(mapStateToProps, mapDispatch)(MyCharacter);
