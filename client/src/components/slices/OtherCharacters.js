import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import OtherCharacter from './OtherCharacter';
import { MY_CHARACTER_INIT_CONFIG } from '../characterConstants';

function OtherCharacters({ otherCharactersData, allCharacters }) {
    // For debugging: log when other characters data changes
    useEffect(() => {
        console.log('Other characters data updated:', otherCharactersData);
    }, [otherCharactersData]);

    // Return null if no other characters data
    if (!otherCharactersData || Object.keys(otherCharactersData).length === 0) {
        return null;
    }

    return (
        <>
            {Object.keys(otherCharactersData).map((id) => {
                const character = otherCharactersData[id];
                // Check if character has all required properties before rendering
                if (character && character.position && character.characterClass) {
                    return (
                        <OtherCharacter 
                            key={id}
                            id={id}
                            name={character.username || 'Unknown'}
                            x={character.position.x}
                            y={character.position.y}
                            characterClass={character.characterClass}
                        />
                    );
                }
                return null;
            })}
        </>
    );
}

const mapStateToProps = (state) => {
    // Make sure allCharacters.users exists
    if (!state.allCharacters || !state.allCharacters.users) {
        return { otherCharactersData: {} };
    }

    // Filter out my character by ID
    const otherCharactersData = Object.keys(state.allCharacters.users)
        .filter(id => id !== MY_CHARACTER_INIT_CONFIG.id)
        .reduce((filteredObj, key) => {
            filteredObj[key] = state.allCharacters.users[key];
            return filteredObj;
        }, {});
    
    return { 
        otherCharactersData,
        allCharacters: state.allCharacters 
    };
};

export default connect(mapStateToProps)(OtherCharacters);