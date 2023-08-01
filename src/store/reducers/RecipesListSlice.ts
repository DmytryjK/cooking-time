import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, push, update } from "firebase/database";

import type { Recipes, Recipe, tagsType } from '../../types/type';

type PayloadActionFilter = {
	searchInput: string;
	searchTags: tagsType[];
	searchCategories: string[];
}

type initialStateRecipes = {
	recipes: Recipe[];
	filteredRecipes: Recipe[];
	recipe: Recipe | null;
	loadingRecipe: 'idle' | 'pending' | 'succeeded' | 'failed';
	loadingRecipes: 'idle' | 'pending' | 'succeeded' | 'failed';
	loadingForm: 'idle' | 'pending' | 'succeeded' | 'failed';
	error: null | unknown;
}

const initialState: initialStateRecipes = {
	recipes: [],
	filteredRecipes: [],
	recipe: null,
	loadingRecipe: 'idle',
	loadingRecipes: 'idle',
	loadingForm: 'idle',
	error: null,
}

type isFavoritePayload = {
	recipeId: string|number|null;
	isFavorite: boolean;
};

export const fetchRecipes = createAsyncThunk(
	'allRecipes/fetchRecipes',
	async function(uid:string, { rejectWithValue }) {
		try {
			const dbRef = ref(getDatabase());
			const responseRecipe = await get(child(dbRef, 'dishes'));

			if (!responseRecipe.exists()) throw new Error('Something went wrong');

			const originalData: Recipe[] = await responseRecipe.val();
			const transformRecepiesToArr: Recipe[]= [];

			const responseFavoritesId = await get(child(dbRef, `favorites/${uid}`));
			const favoriteId:string[] = await responseFavoritesId.val();

			if (favoriteId) {
				for (const key in originalData) {
					originalData[key].favorites = false;
					favoriteId.forEach(favoriteId => {
						if (originalData[key].id === favoriteId) {
							originalData[key].favorites = true;
						} 
					})
				}
			}

			for (const key in originalData) {
				transformRecepiesToArr.push(originalData[key]);
			}

			return { 
				recipes: transformRecepiesToArr,
				originalFetchedRecepies: originalData
			};
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
)

export const fetchRecipe = createAsyncThunk(
	'recepiesList/fetchRecipe',
	async function(id: number | string | undefined, { rejectWithValue }) {
		try {
			const dbRef = ref(getDatabase());
			const response = await get(child(dbRef, 'dishes/' + id));
			
			if (!response.exists()) throw new Error('Something went wrong');
			const data: Recipe = await response.val();
			return data;
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
)

export const postRecipe = createAsyncThunk(
	'recepiesList/postRecipe',
	async function(newRecepie: Recipe, { rejectWithValue }) {
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
		setCurrentRecipes: (state, action: PayloadAction<Recipe[]>) => {
			state.recipes = action.payload;
		},
		setCurrentFilteredRecipes: (state, action: PayloadAction<Recipe[]>) => {
			state.filteredRecipes = action.payload;
		},
		addNewRecipe: (state, action: PayloadAction<Recipe>) => {
			state.recipes.push(action.payload);
		},
		setFavoriteRecipes: (state, action: PayloadAction<isFavoritePayload>) => {
			const { recipeId, isFavorite } = action.payload;
			state.recipes = [...state.recipes.map(recipe => {
				recipe.id === recipeId ? recipe.favorites = isFavorite : recipe.favorites = recipe.favorites;
				return recipe;
			})];
			state.filteredRecipes = [...state.recipes];
		},
		filterRecipes: (state, action: PayloadAction<PayloadActionFilter>) => {
			const {searchInput, searchTags, searchCategories} = action.payload;
			state.filteredRecipes = JSON.parse(JSON.stringify(state.recipes));

			if (!searchInput && searchTags.length === 0 && searchCategories.length === 0) return;
			
			if (searchInput && searchTags.length > 0 && searchCategories.length > 0) {
				state.filteredRecipes = state.filteredRecipes
					.filter(recipe => recipe.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1)
					.filter(recipe => {
						return recipe.ingredients?.some(ingredient => {
							const upperTags = searchTags.map(tag => tag.tagText.toUpperCase());
							return upperTags.some(tag => ingredient.toUpperCase().includes(tag));
						})
					})
					.filter(recipe => searchCategories.includes(recipe.category) === true);
				return;
			} else if (searchInput && searchTags.length > 0) {
				state.filteredRecipes = state.filteredRecipes
					.filter(recipe => recipe.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1)
					.filter(recipe => {
						return recipe.ingredients?.some(ingredient => {
							const upperTags = searchTags.map(tag => tag.tagText.toUpperCase());
							return upperTags.some(tag => ingredient.toUpperCase().includes(tag));
						})
					})
					return;
			} else if (searchInput && searchCategories.length > 0) {
				state.filteredRecipes = state.filteredRecipes
					.filter(recipe => recipe.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1)
					.filter(recipe => searchCategories.includes(recipe.category) === true);
					return;
			} else if (searchTags.length > 0 && searchCategories.length > 0) {
				state.filteredRecipes = state.filteredRecipes
					.filter(recipe => {
						return recipe.ingredients?.some(ingredient => {
							const upperTags = searchTags.map(tag => tag.tagText.toUpperCase());
							return upperTags.some(tag => ingredient.toUpperCase().includes(tag));
						})
					})
					.filter(recipe => searchCategories.includes(recipe.category) === true);
					return;
			} else if (searchInput) {
				state.filteredRecipes = state.filteredRecipes
					.filter(recipe => recipe.title.toLowerCase().indexOf(searchInput.toLowerCase()) > -1);
					return;
			} else if (searchTags.length > 0) {
				state.filteredRecipes = state.filteredRecipes
					.filter(recipe => {
						return recipe.ingredients?.some(ingredient => {
							const upperTags = searchTags.map(tag => tag.tagText.toUpperCase());
							return upperTags.some(tag => ingredient.toUpperCase().includes(tag));
						})
					});
					return;
			} else {
				state.filteredRecipes = state.filteredRecipes
					.filter(recipe => searchCategories.includes(recipe.category) === true);
					return;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRecipe.pending, (state) => {
			state.loadingRecipe = 'pending';
			state.error = null;
		})
		builder.addCase(fetchRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
			state.loadingRecipe = 'succeeded';
			state.recipe = action.payload;
		})
		builder.addCase(fetchRecipe.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingRecipe = 'failed';
			state.error = action.payload;
		})
		builder.addCase(postRecipe.pending, (state) => {
			state.loadingForm = 'pending';
			state.error = null;
		})
		builder.addCase(postRecipe.fulfilled, (state, action: PayloadAction<Recipe>) => {
			state.loadingForm = 'succeeded';
			state.recipes = [...state.recipes, action.payload];
		})
		builder.addCase(postRecipe.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingForm = 'failed';
			state.error = action.payload;
		})
		builder.addCase(fetchRecipes.pending, (state) => {
			state.loadingRecipes = 'pending';
			state.error = null;
		})
		builder.addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<Recipes>) => {
			state.loadingRecipes = 'succeeded';
			state.recipes = action.payload.recipes;
		})
		builder.addCase(fetchRecipes.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingRecipes = 'failed';
			state.error = action.payload;
		})
	},
})

export const { addNewRecipe, setFavoriteRecipes, setCurrentRecipes, filterRecipes, setCurrentFilteredRecipes } = recepieListSlice.actions;

export default recepieListSlice.reducer;
