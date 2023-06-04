import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { userType, user } from '../../types/type';

const initialState: userType = {
    user: {
        uid: '',
        email: ''
    }
}

export const authenticationSlice = createSlice({
	name: 'authentication',
	initialState,
	reducers: {
		createUser: (state, action: PayloadAction<user>) => {
			state.user = {...action.payload};
		},
		// deleteUser: (state, action: PayloadAction<userType>) => {
		// 	state = {...action.payload};
		// }
	}
})

export const { createUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
