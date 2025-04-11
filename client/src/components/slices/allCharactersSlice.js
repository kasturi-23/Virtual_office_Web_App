import { createSlice } from '@reduxjs/toolkit';
import { MY_CHARACTER_INIT_CONFIG } from '../characterConstants';

const allCharactersSlice = createSlice({
    name: 'allCharacters',
    initialState: {
        users: {
            [MY_CHARACTER_INIT_CONFIG.id]: MY_CHARACTER_INIT_CONFIG
        },
    },
    reducers: {
        update(state, action) {
            console.log("allCharactersSlice update updatedUserList: ", action.payload);
            const updatedUserList = action.payload;
            state.users = updatedUserList;
        },
        updateCharacterPosition(state, action) {
            const { id, position } = action.payload;
            console.log("Updating character position:", { id, position });

            if (state.users[id]) {
                state.users[id].position = position;
            } else {
                console.warn(`Character with id ${id} not found in state`);
            }
        }
    }
});

export const { update, updateCharacterPosition } = allCharactersSlice.actions;

export default allCharactersSlice.reducer;