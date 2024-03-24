import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserType, User } from '../../types/type';

const initialState: UserType = {
    user: {
        uid: '',
        email: '',
        emailVerified: null,
        isAdmin: false,
    },
};

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        createUser: (state, action: PayloadAction<User>) => {
            state.user = { ...action.payload, isAdmin: false };
            const { email } = state.user;
            const admins = [
                'vampiryshka777@gmail.com',
                'dmytryj.kyzyma@gmail.com',
                'innatemchenkoo@gmail.com',
                'temchenkoinna19@gmail.com',
            ];
            if (admins.some((adminMail) => adminMail === email)) {
                state.user.isAdmin = true;
            }
        },
    },
});

export const { createUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
