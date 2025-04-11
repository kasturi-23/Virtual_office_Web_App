import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import CanvasContext from './CanvasContext';

import { MAP_DIMENSIONS, TILE_SIZE } from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { checkMapCollision } from './utils';
import { updateCharacterPosition } from './slices/allCharactersSlice'; // Import the new action

import { ref, set } from "firebase/database";

// import { firebaseApp } from "../firebase/firebase"; // adjust path if needed
import { firebaseDatabase } from '../firebase/firebase';

// const firebaseDatabase = getDatabase(firebaseApp);

const MOVE_DIRECTIONS = {
    'w': { x: 0, y: -1 },
    'a': { x: -1, y: 0 },
    's': { x: 0, y: 1 },
    'd': { x: 1, y: 0 }
};

const GameLoop = ({
    children,
    allCharactersData,
    updateCharacterPosition, // Use the new action creator
}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);

    useEffect(() => {
        console.log('initial setContext');
        setContext({
            canvas: canvasRef.current.getContext('2d'),
            frameCount: 0,
        });
    }, [setContext]);

    const loopRef = useRef();
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id] || { position: { x: 0, y: 0 } };

    const moveMyCharacter = useCallback(
        (e) => {
            const key = e.key.toLowerCase();
            console.log(`Key pressed: ${key}`);
            console.log('Current character position:', mycharacterData.position);

            if (MOVE_DIRECTIONS[key]) {
                console.log(`Valid movement key detected: ${key}`);

                const delta = MOVE_DIRECTIONS[key];
                const currentPosition = mycharacterData.position;

                // Compute new position
                const newPosition = {
                    x: currentPosition.x + delta.x,
                    y: currentPosition.y + delta.y,
                };

                console.log(`New position calculated: `, newPosition);

                // Check for collisions before updating position
                if (!checkMapCollision(newPosition.x, newPosition.y)) {
                    console.log(`Updating position in Redux`);
                    set(ref(firebaseDatabase, 'users/' + MY_CHARACTER_INIT_CONFIG.id + '/position'), {
                        x: newPosition.x,
                        y: newPosition.y,
                    });
                    updateCharacterPosition({
                        id: mycharacterData.id,
                        position: newPosition
                    });
                } else {
                    console.log(`Collision detected, movement blocked`);
                }
            }
        },
        [mycharacterData, updateCharacterPosition]
    );

    const tick = useCallback(() => {
        if (context != null) {
            setContext({
                canvas: context.canvas,
                frameCount: (context.frameCount + 1) % 60,
            });
        }
        loopRef.current = requestAnimationFrame(tick);
    }, [context]);

    useEffect(() => {
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        };
    }, [loopRef, tick]);

    useEffect(() => {
        document.addEventListener('keydown', moveMyCharacter);
        return () => {
            document.removeEventListener('keydown', moveMyCharacter);
        };
    }, [moveMyCharacter]);

    return (
        <CanvasContext.Provider value={context}>
            <canvas
                ref={canvasRef}
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                className="main-canvas"
            />
            {children}
        </CanvasContext.Provider>
    );
};

const mapStateToProps = (state) => {
    return {
        allCharactersData: state.allCharacters.users
    };
};

const mapDispatchToProps = {
    updateCharacterPosition
};

export default connect(mapStateToProps, mapDispatchToProps)(GameLoop);