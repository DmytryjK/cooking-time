import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, push, update } from "firebase/database";

import type { Recepies, Recepie, PostState } from '../../types/type';

const initialState: Recepies & PostState = {
	recepies: [],
	fetchedRecepieInfo: null,
	loading: 'idle',
	loadingForm: 'idle',
	error: null,
}

type isFavoritePayload = {
	recipeId: string|number|null;
	isFavorite: boolean;
};

export const fetchRecepie = createAsyncThunk(
	'recepiesList/fetchRecepie',
	async function(id: number | string | undefined, { rejectWithValue }) {
		try {
			const dbRef = ref(getDatabase());
			const response = await get(child(dbRef, 'dishes/' + id));
			
			if (!response.exists()) throw new Error('Something went wrong');
			const data: Recepie = await response.val();
			return data;
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
)

export const postRecepie = createAsyncThunk(
	'recepiesList/postRecepie',
	async function(newRecepie: Recepie, { rejectWithValue }) {
		try{
			const db = getDatabase();
			const newPostKey = push(child(ref(db), 'dishes')).key;
			const postData = {...newRecepie, id: newPostKey};

			const updates: any = {};
			updates['/dishes/' + newPostKey] = postData;

			update(ref(db), updates);
			return postData;
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
);

// export const updateRecipeInfo = createAsyncThunk(
// 	'recepiesList/updateRecipeInfo',
// 	async function(recipeInfo: Recepie, { rejectWithValue }) {
// 		try{
// 			const db = getDatabase();
// 			const recipeId = recipeInfo.id;

// 			const updates: any = {};
// 			updates[`dishes/${recipeId}`] = {...recipeInfo};

// 			update(ref(db), updates)
// 				.then(() => {
// 					console.log('Поле рецепта успешно обновлено');
// 				});

// 		} catch (error: unknown) {
// 			return rejectWithValue(error);
// 		}
// 	}
// );

export const recepieListSlice = createSlice({
	name: 'recepiesList',
	initialState,
	reducers: {
		// setCurrentRecipes: (state, action: PayloadAction<Recepie[]>) => {
		// 	state.recepies = action.payload;
		// },
		addNewRecepie: (state, action: PayloadAction<Recepie>) => {
			state.recepies.push(action.payload);
		},
		setFavoriteRecipes: (state, action: PayloadAction<isFavoritePayload>) => {
			const { recipeId, isFavorite } = action.payload;

			state.recepies = [...state.recepies.map(recepie => {
				recepie.id === recipeId ? recepie.favorites = isFavorite : recepie.favorites = recepie.favorites;
				return recepie;
			})];
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRecepie.pending, (state) => {
			state.loading = 'pending';
			state.error = null;
		})
		builder.addCase(fetchRecepie.fulfilled, (state, action: PayloadAction<Recepie>) => {
			state.loading = 'succeeded';
			state.fetchedRecepieInfo = action.payload;
		})
		builder.addCase(fetchRecepie.rejected, (state, action: PayloadAction<unknown>) => {
			state.loading = 'failed';
			state.error = action.payload;
		})
		builder.addCase(postRecepie.pending, (state) => {
			state.loadingForm = 'pending';
			state.error = null;
		})
		builder.addCase(postRecepie.fulfilled, (state, action: PayloadAction<Recepie>) => {
			state.loadingForm = 'succeeded';
			state.recepies = [...state.recepies, action.payload];
		})
		builder.addCase(postRecepie.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingForm = 'failed';
			state.error = action.payload;
		})
	},
})

export const { addNewRecepie, setFavoriteRecipes } = recepieListSlice.actions;

export default recepieListSlice.reducer;
