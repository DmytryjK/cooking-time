import { configureStore } from '@reduxjs/toolkit'
import FiltersReducer from './reducers/FiltersSlice';
import RecepiesReducer from './reducers/RecepieListSlice';
import allRecipesReducer from '../pages/MainPage/components/AllRecipes/AllRecipesSlice';
import AuthenticationReducer from './reducers/AuthenticationSlice';
import FavoriteRecipesReducer from './reducers/FavoritesRecipesSlice';

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
