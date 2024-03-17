import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, update } from 'firebase/database';
import { TagsType, Recipe, Loading } from '../../types/type';

type PayloadActionFilter = {
    searchInput: string;
    searchTags: TagsType[];
    searchCategories: string[];
};

type SearchedConstruction = {
    recipeIngredient: string;
    userSearchTag: string;
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

function levenshteinDistance(a: string, b: string) {
    const distanceMatrix = Array(b.length + 1)
        .fill(null)
        .map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i += 1) {
        distanceMatrix[0][i] = i;
    }

    for (let j = 0; j <= b.length; j += 1) {
        distanceMatrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j += 1) {
        for (let i = 1; i <= a.length; i += 1) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            distanceMatrix[j][i] = Math.min(
                distanceMatrix[j][i - 1] + 1,
                distanceMatrix[j - 1][i] + 1,
                distanceMatrix[j - 1][i - 1] + indicator
            );
        }
    }

    return distanceMatrix[b.length][a.length];
}

const filterByIngredients = (recipe: Recipe, searchTags: TagsType[]) => {
    let searchedConstruction: SearchedConstruction = {
        recipeIngredient: '',
        userSearchTag: '',
    };
    const result = searchTags.every((tag) => {
        return recipe.ingredients?.some((ingredient) => {
            const tagLower = tag.tagText.toLowerCase().trim();
            const ingredientLower = ingredient.tagText.toLowerCase().trim();
            const ingredientParts = ingredientLower.split(/[' '-]/g);
            const tagParts =
                tagLower.length > 1 ? tagLower.split(/[' '-]/g) : [tagLower];
            let result = false;
            ingredientParts.some((part) => {
                return tagParts.some((tagPart) => {
                    if (tagPart[0] !== part[0] || tagPart[1] !== part[1])
                        return false;
                    const distance = levenshteinDistance(part, tagPart);
                    result = distance <= part.length / 2.2;
                    searchedConstruction = {
                        recipeIngredient: part,
                        userSearchTag: tag.tagText,
                    };
                    if (part.includes(tagPart)) {
                        const str = part.replace(tagPart, '');
                        result = tagPart.length > str.length;
                        searchedConstruction = {
                            recipeIngredient: part,
                            userSearchTag: tag.tagText,
                        };
                    }
                    if (result) return true;
                    searchedConstruction = {
                        recipeIngredient: '',
                        userSearchTag: '',
                    };
                    return false;
                });
            });
            return result;
        });
    });
    return { isCorrect: result, searchedConstruction };
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
            )
                return;
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
                const uniqSearchedTags: SearchedConstruction[] = [];
                searchedWord.forEach((word, index) => {
                    const { userSearchTag, recipeIngredient } = word;
                    if (index === 0) {
                        uniqSearchedTags.push(word);
                    } else if (
                        !uniqSearchedTags.some(
                            (uniqTag) =>
                                uniqTag.recipeIngredient === recipeIngredient &&
                                uniqTag.userSearchTag === userSearchTag
                        )
                    ) {
                        uniqSearchedTags.push(word);
                    }
                });

                state.searchedTagFilledFavorites = [
                    ...state.searchedTagFilledFavorites,
                    ...uniqSearchedTags,
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
