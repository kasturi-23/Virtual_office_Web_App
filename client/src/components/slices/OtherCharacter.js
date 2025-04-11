import React, { useContext, useEffect, useRef } from 'react';
import CanvasContext from '../CanvasContext';
import { CHARACTER_IMAGE_SIZE, CHARACTER_CLASSES_MAP } from '../characterConstants';
import { TILE_SIZE } from '../mapConstants';

function OtherCharacter({ id, name, x, y, characterClass }) {
    const context = useContext(CanvasContext);
    const positionRef = useRef({ x, y });
    
    // Clear previous position and draw at new position when position changes
    useEffect(() => {
        if (context == null) {
            return;
        }
        
        // Clear previous position if it's different
        if (positionRef.current.x !== x || positionRef.current.y !== y) {
            context.canvas.clearRect(
                positionRef.current.x * TILE_SIZE,
                positionRef.current.y * TILE_SIZE,
                CHARACTER_IMAGE_SIZE,
                CHARACTER_IMAGE_SIZE
            );
        }
        
        // Update ref with current position
        positionRef.current = { x, y };
        
        // Draw character at current position
        const characterImg = document.querySelector(`#character-sprite-img-${characterClass}`);
        if (characterImg) {
            const { sx, sy } = CHARACTER_CLASSES_MAP[characterClass].icon;
            context.canvas.drawImage(
                characterImg,
                sx,
                sy,
                CHARACTER_IMAGE_SIZE - 5,
                CHARACTER_IMAGE_SIZE - 5,
                x * TILE_SIZE,
                y * TILE_SIZE,
                CHARACTER_IMAGE_SIZE,
                CHARACTER_IMAGE_SIZE
            );
        }
    }, [context, x, y, characterClass]);
    
    // Clean up when component unmounts
    useEffect(() => {
        return () => {
            if (context) {
                context.canvas.clearRect(
                    positionRef.current.x * TILE_SIZE,
                    positionRef.current.y * TILE_SIZE,
                    CHARACTER_IMAGE_SIZE,
                    CHARACTER_IMAGE_SIZE
                );
            }
        };
    }, [context]);

    return null;
}

export default OtherCharacter;