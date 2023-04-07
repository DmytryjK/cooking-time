import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Recepie } from '../RecipeList/RecepieListSlice';

export interface createdRecepie {
	createdRecepie: Recepie
}

const initialState = {
	createdRecepie: {}
}

export const addingRecepiesFormSlice = createSlice({
	name: 'addRecepie',
	initialState,
	reducers: {
		createRecepie: (state, action: PayloadAction<Recepie>) => {
			state.createdRecepie = action.payload;
		}
	}
})

export const { createRecepie } = addingRecepiesFormSlice.actions;

export default addingRecepiesFormSlice.reducer;
