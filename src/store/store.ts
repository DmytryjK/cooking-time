import { configureStore } from '@reduxjs/toolkit'
import FiltersReducer from '../components/Filters/FiltersSlice';
import RecepiesReducer from '../components/RecipeList/RecepieListSlice';
import allRecipesReducer from '../components/AllRecipes/AllRecipesSlice';
import AuthenticationReducer from '../components/Authentication/AuthenticationSlice';
import FavoriteRecipesReducer from '../components/FavoritesRecipes/FavoritesRecipesSlice';

export const store = configureStore({
	reducer: {
		recepies: RecepiesReducer,
		allRecipes: allRecipesReducer,
		filters: FiltersReducer,
		authentication: AuthenticationReducer,
		favoriteRecipes: FavoriteRecipesReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
