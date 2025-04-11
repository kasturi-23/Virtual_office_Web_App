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
<<<<<<< HEAD

    
    const initialPosition = myCharactersData?.position || { x: 5, y: 5 };
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        if (!webrtcSocket || !webrtcSocket.id) {
            console.warn(" Socket not available.");
            return;
        }

=======
    useEffect(() => {
>>>>>>> 1219046 (Connected to firebase)
        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
        };

        const users = {};
        const myId = MY_CHARACTER_INIT_CONFIG.id;
        users[myId] = myInitData;
        set(ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id), myInitData);
    }, [webrtcSocket]);

<<<<<<< HEAD
    // Handle WASD Movement
=======
>>>>>>> 1219046 (Connected to firebase)
    useEffect(() => {
        const usersRef = ref(firebaseDatabase, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                updateAllCharactersData(data); // Updating Redux slice
            }
        });
    }, [updateAllCharactersData]);

<<<<<<< HEAD
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
=======
    useEffect(() => {
        if (context == null || myCharactersData == null) {
>>>>>>> 1219046 (Connected to firebase)
            return;
        }
        const characterImg = document.querySelector(`#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`);
<<<<<<< HEAD
        if (!characterImg) {
            console.warn("Character sprite image not found.");
            return;
        }

=======
>>>>>>> 1219046 (Connected to firebase)
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

<<<<<<< HEAD
// Prevent "undefined position" error by setting a default value
=======
>>>>>>> 1219046 (Connected to firebase)
const mapStateToProps = (state) => {
    return { myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id] };
};

const mapDispatch = { loadCharacter, updateAllCharactersData };

export default connect(mapStateToProps, mapDispatch)(MyCharacter);