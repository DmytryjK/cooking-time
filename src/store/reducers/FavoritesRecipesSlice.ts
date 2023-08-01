import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, update } from "firebase/database";

import type { Recipe } from '../../types/type';

type TypeFavoriteRecipes = {
	favoriteRecipes: Recipe[];
	loadingRecipesById: 'idle' | 'pending' | 'succeeded' | 'failed';
	loadingRecipeIdToFirebase: 'idle' | 'pending' | 'succeeded' | 'failed';
	error: null | unknown;
	currentFavoriteId: string |  number | null; 
}

const initialState: TypeFavoriteRecipes = {
	favoriteRecipes: [],
	loadingRecipesById: 'idle',
	loadingRecipeIdToFirebase: 'idle',
	error: null,
	currentFavoriteId: null,
}

export const fetchFavoritesRecipe = createAsyncThunk(
	'favoriteRecipes/fetchFavoritesId',
	async function(uid: string, { rejectWithValue }) {
		try {
			const db = getDatabase();
			const dbRef = ref(db);
			const favoritesRecipeRef = ref(db, 'favorites');

			const favoritesTomSnapshot = await get(favoritesRecipeRef);
			const userFavoritesRecipesSnapshot = await get(child(favoritesRecipeRef, uid));

			let recipesData: Recipe[] = [];
			
			if (favoritesTomSnapshot.exists()) {
				let response;
				if (userFavoritesRecipesSnapshot.exists()) {
					response = await get(child(dbRef, `favorites/${uid}`));
					if (!response.exists()) {
						throw new Error('Упс... что-то пошло не так, попробуйте ещё раз!');
					} else {
						const favoriteRecipesId = [...response.val()];

						const queries = favoriteRecipesId.map((recipeId) => get(ref(db, `dishes/${recipeId}`)));

						const snapshots = await Promise.all(queries);
						const responseRecipes: Recipe[] = snapshots.map((snapshot) => {
							const result = {...snapshot.val(), favorites: true}
							return result;
						});
						recipesData = [...responseRecipes];
					};
				} else {
					recipesData = [];
				}
			} else { 
				recipesData = [];
			}
			return recipesData;
		} catch (error: unknown) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			} else {
				return rejectWithValue('Произошла неизвестная ошибка');
			}
		}
	}
)

export const manageFavoritesRecipes = createAsyncThunk(
	'favoriteRecipes/manageFavoritesRecipes',
	async function({recepieId, uid}:{recepieId: string|number|null, uid: string}, { rejectWithValue }) {
		try{
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

			await update(userRef, { [uid]: currentRecipe });
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
		setCurrentFavoriteId: (state, action: PayloadAction<string | number | null>) => {
			state.currentFavoriteId = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchFavoritesRecipe.pending, (state) => {
			state.loadingRecipesById = 'pending';
			state.error = null;
		})
		builder.addCase(fetchFavoritesRecipe.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
			state.favoriteRecipes = action.payload;
			state.loadingRecipesById = 'succeeded';
		})
		builder.addCase(fetchFavoritesRecipe.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingRecipesById = 'failed';
			state.error = action.payload;
		})
		builder.addCase(manageFavoritesRecipes.pending, (state) => {
			state.loadingRecipeIdToFirebase = 'pending';
			state.error = null;
		})
		builder.addCase(manageFavoritesRecipes.fulfilled, (state, action:PayloadAction<string|number|undefined>) => {
			state.loadingRecipeIdToFirebase = 'succeeded';
			state.favoriteRecipes = state.favoriteRecipes.filter(item => item.id !== action.payload);
		})
		builder.addCase(manageFavoritesRecipes.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingRecipeIdToFirebase = 'failed';
			state.error = action.payload;
		})
	},
})
export const { setCurrentFavoriteId } = favoriteRecipesSlice.actions; 
export default favoriteRecipesSlice.reducer;
