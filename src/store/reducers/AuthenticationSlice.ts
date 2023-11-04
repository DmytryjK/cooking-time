import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserType, User } from '../../types/type';

const initialState: UserType = {
    user: {
        uid: '',
        email: '',
    },
};

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        createUser: (state, action: PayloadAction<User>) => {
            state.user = { ...action.payload };
        },
    },
});

export const { createUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
