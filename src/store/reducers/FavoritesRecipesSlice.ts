import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, update } from 'firebase/database';
import {
    filterByIngredients,
    uniqSearchedTags,
} from '../../helpers/filterRecipes';
import { TagsType, Recipe, Loading } from '../../types/type';
import type { SearchedConstruction } from '../../helpers/filterRecipes/filterByIngredients';

type PayloadActionFilter = {
    searchInput: string;
    searchTags: TagsType[];
    searchCategories: string[];
};

type TypeFavoriteRecipes = {
    favoriteRecipes: Recipe[];
    filteredFavoriteRecipes: Recipe[];
    searchedTagFilledFavorites: SearchedConstruction[];
    loadingRecipesById: Loading;
    loadingRecipeIdToFirebase: Loading;
    error: null | unknown;
    currentFavoriteId: string | number | null;
    searchedNameOfDishes: string;
};

const initialState: TypeFavoriteRecipes = {
    favoriteRecipes: [],
    filteredFavoriteRecipes: [],
    searchedTagFilledFavorites: [],
    loadingRecipesById: 'idle',
    loadingRecipeIdToFirebase: 'idle',
    error: null,
    currentFavoriteId: null,
    searchedNameOfDishes: '',
};

export const fetchFavoritesRecipes = createAsyncThunk(
    'favoriteRecipes/fetchFavoritesRecipes',
    async function (uid: string, { rejectWithValue }) {
        try {
            const db = getDatabase();
            const dbRef = ref(db);
            const favoritesRecipeRef = ref(db, 'favorites');

            const favoritesTomSnapshot = await get(favoritesRecipeRef);
            const userFavoritesRecipesSnapshot = await get(
                child(favoritesRecipeRef, uid)
            );

            let recipesData: Recipe[] = [];

            if (favoritesTomSnapshot.exists()) {
                let response;
                if (userFavoritesRecipesSnapshot.exists()) {
                    response = await get(child(dbRef, `favorites/${uid}`));
                    if (!response.exists()) {
                        throw new Error(
                            'Упс... что-то пошло не так, попробуйте ещё раз!'
                        );
                    } else {
                        const favoriteRecipesId = [...response.val()];

                        const queries = favoriteRecipesId.map((recipeId) =>
                            get(ref(db, `dishes/${recipeId}`))
                        );

                        const snapshots = await Promise.all(queries);
                        const responseRecipes: Recipe[] = snapshots.map(
                            (snapshot) => {
                                const result = {
                                    ...snapshot.val(),
                                    favorites: true,
                                };
                                return result;
                            }
                        );
                        recipesData = [...responseRecipes];
                    }
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
            }
            return rejectWithValue('Произошла неизвестная ошибка');
        }
    }
);

export const manageFavoritesRecipes = createAsyncThunk(
    'favoriteRecipes/manageFavoritesRecipes',
    async function (
        { item, uid }: { item: Recipe; uid: string },
        { rejectWithValue }
    ) {
        try {
            const { id } = item;
            const db = getDatabase();
            const userRef = ref(db, `favorites/`);

            const snapshot = await get(userRef);
            let currentRecipe: (string | number)[] = [];

            if (snapshot.exists()) {
                const userData = snapshot.val();
                currentRecipe = userData[uid] || [];
            }

            if (typeof id === 'string' || typeof id === 'number') {
                if (!currentRecipe.includes(id)) {
                    currentRecipe.push(id);
                } else {
                    const index = currentRecipe.indexOf(id);
                    if (index > -1) {
                        currentRecipe.splice(index, 1);
                    }
                }
            } else if (id === null) {
                return undefined;
            }

            await update(userRef, { [uid]: currentRecipe });
            return { ...item };
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

export const favoriteRecipesSlice = createSlice({
    name: 'favoriteRecipes',
    initialState,
    reducers: {
        setCurrentFavoriteId: (
            state,
            action: PayloadAction<string | number | null>
        ) => {
            state.currentFavoriteId = action.payload;
        },
        resetFavoriteRecipes: (state) => {
            state.favoriteRecipes = [];
            state.filteredFavoriteRecipes = [];
            state.loadingRecipesById = 'idle';
        },
        filterFavoriteRecipes: (
            state,
            action: PayloadAction<PayloadActionFilter>
        ) => {
            const { searchInput, searchTags, searchCategories } =
                action.payload;
            state.filteredFavoriteRecipes = JSON.parse(
                JSON.stringify(state.favoriteRecipes)
            );
            const searchedWord: SearchedConstruction[] = [];
            if (!searchInput) {
                state.searchedNameOfDishes = '';
            }
            if (
                !searchInput &&
                searchTags.length === 0 &&
                searchCategories.length === 0
            ) {
                state.searchedTagFilledFavorites = [];
                return;
            }
            if (searchInput) {
                state.searchedNameOfDishes = searchInput;
            }
            if (
                searchInput &&
                searchTags.length > 0 &&
                searchCategories.length > 0
            ) {
                state.filteredFavoriteRecipes = state.filteredFavoriteRecipes
                    .filter(
                        (recipe) =>
                            recipe.title
                                .toLowerCase()
                                .indexOf(searchInput.toLowerCase()) > -1
                    )
                    .filter((recipe) => {
                        const { isCorrect, searchedConstruction } =
                            filterByIngredients(recipe, searchTags);
                        if (
                            isCorrect &&
                            searchedConstruction.recipeIngredient !== ''
                        ) {
                            searchedWord.push({
                                ...searchedConstruction,
                            });
                        }
                        return isCorrect;
                    })
                    .filter(
                        (recipe) =>
                            searchCategories.includes(recipe.category) === true
                    );
            } else if (searchInput && searchTags.length > 0) {
                state.filteredFavoriteRecipes = state.filteredFavoriteRecipes
                    .filter(
                        (recipe) =>
                            recipe.title
                                .toLowerCase()
                                .indexOf(searchInput.toLowerCase()) > -1
                    )
                    .filter((recipe) => {
                        const { isCorrect, searchedConstruction } =
                            filterByIngredients(recipe, searchTags);
                        if (
                            isCorrect &&
                            searchedConstruction.recipeIngredient !== ''
                        ) {
                            searchedWord.push({
                                ...searchedConstruction,
                            });
                        }
                        return isCorrect;
                    });
            } else if (searchInput && searchCategories.length > 0) {
                state.filteredFavoriteRecipes = state.filteredFavoriteRecipes
                    .filter(
                        (recipe) =>
                            recipe.title
                                .toLowerCase()
                                .indexOf(searchInput.toLowerCase()) > -1
                    )
                    .filter(
                        (recipe) =>
                            searchCategories.includes(recipe.category) === true
                    );
            } else if (searchTags.length > 0 && searchCategories.length > 0) {
                state.filteredFavoriteRecipes = state.filteredFavoriteRecipes
                    .filter((recipe) => {
                        const { isCorrect, searchedConstruction } =
                            filterByIngredients(recipe, searchTags);
                        if (
                            isCorrect &&
                            searchedConstruction.recipeIngredient !== ''
                        ) {
                            searchedWord.push({
                                ...searchedConstruction,
                            });
                        }
                        return isCorrect;
                    })
                    .filter(
                        (recipe) =>
                            searchCategories.includes(recipe.category) === true
                    );
            } else if (searchInput) {
                state.filteredFavoriteRecipes =
                    state.filteredFavoriteRecipes.filter(
                        (recipe) =>
                            recipe.title
                                .toLowerCase()
                                .indexOf(searchInput.toLowerCase()) > -1
                    );
            } else if (searchTags.length > 0) {
                state.filteredFavoriteRecipes =
                    state.filteredFavoriteRecipes.filter((recipe) => {
                        const { isCorrect, searchedConstruction } =
                            filterByIngredients(recipe, searchTags);
                        if (
                            isCorrect &&
                            searchedConstruction.recipeIngredient !== ''
                        ) {
                            searchedWord.push({
                                ...searchedConstruction,
                            });
                        }
                        return isCorrect;
                    });
            } else {
                state.filteredFavoriteRecipes =
                    state.filteredFavoriteRecipes.filter(
                        (recipe) =>
                            searchCategories.includes(recipe.category) === true
                    );
            }
            if (searchedWord.length > 0 && searchTags.length > 0) {
                state.searchedTagFilledFavorites = [
                    ...state.searchedTagFilledFavorites,
                    ...uniqSearchedTags(searchedWord),
                ];
            }
        },
        setCurrentFilteredFavoriteRecipes: (
            state,
            action: PayloadAction<Recipe[]>
        ) => {
            state.filteredFavoriteRecipes = action.payload;
        },
        localRemoveFavoriteRecipe: (
            state,
            action: PayloadAction<string | number>
        ) => {
            state.favoriteRecipes = state.favoriteRecipes.filter(
                (recipe) => recipe.id !== action.payload
            );
            state.filteredFavoriteRecipes =
                state.filteredFavoriteRecipes.filter(
                    (recipe) => recipe.id !== action.payload
                );
        },
        removeSearchedTagFilledFavorites: (
            state,
            action: PayloadAction<number>
        ) => {
            state.searchedTagFilledFavorites =
                state.searchedTagFilledFavorites.filter(
                    (item, index) => index !== action.payload
                );
        },
        resetSearchedTagFilledFavorites: (state) => {
            state.searchedTagFilledFavorites = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFavoritesRecipes.pending, (state) => {
            state.loadingRecipesById = 'pending';
            state.error = null;
        });
        builder.addCase(
            fetchFavoritesRecipes.fulfilled,
            (state, action: PayloadAction<Recipe[]>) => {
                state.favoriteRecipes = action.payload;
                state.loadingRecipesById = 'succeeded';
            }
        );
        builder.addCase(
            fetchFavoritesRecipes.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.loadingRecipesById = 'failed';
                state.error = action.payload;
            }
        );
        builder.addCase(manageFavoritesRecipes.pending, (state) => {
            state.loadingRecipeIdToFirebase = 'pending';
            state.error = null;
        });
        builder.addCase(
            manageFavoritesRecipes.fulfilled,
            (state, action: PayloadAction<Recipe | undefined>) => {
                if (!action.payload) return;
                const { id, favorites } = action.payload;
                if (
                    state.favoriteRecipes.some(
                        (favoriteItem) => favoriteItem.id === id
                    )
                ) {
                    state.favoriteRecipes = state.favoriteRecipes.filter(
                        (item) => item.id !== id
                    );
                    state.filteredFavoriteRecipes =
                        state.filteredFavoriteRecipes.filter(
                            (item) => item.id !== id
                        );
                } else {
                    state.favoriteRecipes = [
                        ...state.favoriteRecipes,
                        { ...action.payload, favorites: true },
                    ];
                    state.filteredFavoriteRecipes = [
                        ...state.filteredFavoriteRecipes,
                        { ...action.payload, favorites: true },
                    ];
                }
                state.loadingRecipeIdToFirebase = 'succeeded';
            }
        );
        builder.addCase(
            manageFavoritesRecipes.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.loadingRecipeIdToFirebase = 'failed';
                state.error = action.payload;
            }
        );
    },
});
export const {
    setCurrentFavoriteId,
    resetFavoriteRecipes,
    filterFavoriteRecipes,
    setCurrentFilteredFavoriteRecipes,
    localRemoveFavoriteRecipe,
} = favoriteRecipesSlice.actions;
export default favoriteRecipesSlice.reducer;
