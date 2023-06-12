import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, push, update, set, remove } from "firebase/database";

import type { Recepies, Recepie, PostState } from '../../types/type';


const initialState: Recepies & PostState = {
	recepies: [],
    loading: 'idle',
	error: null,
}

export const fetchRecepies = createAsyncThunk(
	'allRecipes/fetchRecepies',
	async function(_, { rejectWithValue }) {

		try {
			const dbRef = ref(getDatabase());
			const response = await get(child(dbRef, 'dishes'));

			if (!response.exists()) throw new Error('Something went wrong');

			const originalData: Recepie[] = await response.val();
			const transformRecepiesToArr: Recepie[]= [];

			for (const key in originalData) transformRecepiesToArr.push(originalData[key]);
			return { 
				recepies: transformRecepiesToArr,
				originalFetchedRecepies: originalData
			};
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
)

export const allRecipesSlice = createSlice({
	name: 'recepiesList',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRecepies.pending, (state) => {
			state.loading = 'pending';
			state.error = null;
		})
		builder.addCase(fetchRecepies.fulfilled, (state, action: PayloadAction<Recepies>) => {
			state.loading = 'succeeded';
			state.recepies = action.payload.recepies;
		})
		builder.addCase(fetchRecepies.rejected, (state, action: PayloadAction<unknown>) => {
			state.loading = 'failed';
			state.error = action.payload;
		})
	},
}) 

export default allRecipesSlice.reducer;