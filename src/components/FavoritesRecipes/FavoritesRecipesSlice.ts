import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, push, update, set, remove } from "firebase/database";

import type { FavoriteRecipes, Recepie } from '../../types/type';

const initialState: FavoriteRecipes = {
	favoriteRecipes: [],
    favoriteRecipesId: [],
	loadingRecipeId: 'idle',
	loadingRecipesById: 'idle',
	error: null,
}

export const fetchFavoritesId = createAsyncThunk(
	'favoriteRecipes/fetchFavoritesId',
	async function(uid: string, { rejectWithValue }) {
		try {
			const db = getDatabase();
			const dbRef = ref(db);
			const favoritesRecipeRef = ref(db, 'favorites');

			const favoritesTomSnapshot = await get(favoritesRecipeRef);
			const userFavoritesRecipesSnapshot = await get(child(favoritesRecipeRef, uid));

			let originalData: string[] = [];
			
			if (favoritesTomSnapshot.exists()) {
				let response;
				if (userFavoritesRecipesSnapshot.exists()) {
					response = await get(child(dbRef, `favorites/${uid}`));
					if (!response.exists()) {
						throw new Error('Упс... что-то пошло не так, попробуйте ещё раз!');
					} else {
						originalData = [...response.val()];
					};
				} else {
					originalData = [];
				}
			} else { 
				originalData = [];
			}

			return originalData;
		} catch (error: unknown) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('Произошла неизвестная ошибка');
			}
		}
	}
)

export const fetchFavoritesRecipesById = createAsyncThunk(
	'favoriteRecipes/fetchFavoritesRecipesById',
	async function(favoriteRecipesId: string[], { rejectWithValue }) {
		try {
			const dbRef = getDatabase();
			const queries = favoriteRecipesId.map((recipeId) => get(ref(dbRef, `dishes/${recipeId}`)));

			const snapshots = await Promise.all(queries);
			const recipesData = snapshots.map((snapshot) => snapshot.val());

			return recipesData;
		} catch (error) {
			return rejectWithValue(error);
		}
	}
)

export const manageFavoritesRecipes = createAsyncThunk(
	'favoriteRecipes/manageFavoritesRecipes',
	async function({recepieId, uid}:{recepieId: string|number|null, uid: string}, { rejectWithValue }) {
		try{
			console.log('manageFavoritesRecipes')
			const db = getDatabase();
			const userRef = ref(db, `favorites/`);

			const snapshot = await get(userRef);
			let currentRecipe: (string | number)[] = [];

			if (snapshot.exists()) {
				const userData = snapshot.val();
				currentRecipe = userData[uid] || [];
			}

			if (typeof recepieId === 'string' || typeof recepieId === 'number') {
				if (!currentRecipe.includes(recepieId)) {
				  currentRecipe.push(recepieId);
				} else {
				  const index = currentRecipe.indexOf(recepieId);
				  if (index > -1) {
					currentRecipe.splice(index, 1);
				  }
				}
			} else if (recepieId === null) {
				return;
			}

			await set(userRef, { [uid]: currentRecipe });
    		return recepieId;
			
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
);

export const favoriteRecipesSlice = createSlice({
	name: 'favoriteRecipes',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(fetchFavoritesId.pending, (state) => {
			state.loadingRecipeId = 'pending';
			state.error = null;
		})
		builder.addCase(fetchFavoritesId.fulfilled, (state, action: PayloadAction<string[]>) => {
			state.favoriteRecipesId = action.payload;
			state.loadingRecipeId = 'succeeded';
		})
		builder.addCase(fetchFavoritesId.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingRecipeId = 'failed';
			state.error = action.payload;
		})
		builder.addCase(fetchFavoritesRecipesById.pending, (state) => {
			state.loadingRecipesById = 'pending';
			state.error = null;
		})
		builder.addCase(fetchFavoritesRecipesById.fulfilled, (state, action: PayloadAction<Recepie[]>) => {
			state.favoriteRecipes = action.payload;
			state.loadingRecipesById = 'succeeded';
		})
		builder.addCase(fetchFavoritesRecipesById.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingRecipesById = 'failed';
			state.error = action.payload;
		})
		builder.addCase(manageFavoritesRecipes.pending, (state) => {
			state.loadingRecipeId = 'pending';
			state.error = null;
		})
		builder.addCase(manageFavoritesRecipes.fulfilled, (state) => {
			state.loadingRecipeId = 'succeeded';
		})
		builder.addCase(manageFavoritesRecipes.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingRecipeId = 'failed';
		})
	},
})

export default favoriteRecipesSlice.reducer;
