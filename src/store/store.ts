import { configureStore } from '@reduxjs/toolkit';
import FiltersReducer from './reducers/FiltersSlice';
import RecipesReducer from './reducers/RecipesListSlice';
import AuthenticationReducer from './reducers/AuthenticationSlice';
import FavoriteRecipesReducer from './reducers/FavoritesRecipesSlice';
import CreateRecipeFormReducer from './reducers/CreateRecipeFormSlice';
import RecenltyViewedReducer from './reducers/RecenltyViewedSlice';

export const store = configureStore({
    reducer: {
        recipes: RecipesReducer,
        filters: FiltersReducer,
        authentication: AuthenticationReducer,
        favoriteRecipes: FavoriteRecipesReducer,
        createRecipeForm: CreateRecipeFormReducer,
        recenltyViewed: RecenltyViewedReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
