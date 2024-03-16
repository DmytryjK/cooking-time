import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getDatabase,
    ref,
    child,
    get,
    push,
    update,
    remove,
} from 'firebase/database';

import type { Recipes, Recipe, TagsType, Loading } from '../../types/type';

type PayloadActionFilter = {
    searchInput: string;
    searchTags: TagsType[];
    searchCategories: string[];
};

type InitialStateRecipes = {
    recipes: Recipe[];
    filteredRecipes: Recipe[];
    recipe: Recipe | null;
    loadingRecipe: Loading;
    loadingRecipes: Loading;
    loadingForm: Loading;
    removeRecipeLoading: Loading;
    error: null | unknown;
    removeRecipeError: null | unknown;
    searchedNameOfDishes: string;
};

type IsFavoritePayload = {
    recipeId: string | number | null;
    isFavorite: boolean;
};

const initialState: InitialStateRecipes = {
    recipes: [],
    filteredRecipes: [],
    recipe: null,
    loadingRecipe: 'idle',
    loadingRecipes: 'idle',
    loadingForm: 'idle',
    removeRecipeLoading: 'idle',
    error: null,
    removeRecipeError: null,
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
    return searchTags.every((tag) => {
        return recipe.ingredients?.some((ingredient) => {
            const tagLower = tag.tagText.toLowerCase().trim();
            const ingredientLower = ingredient.tagText.toLowerCase().trim();
            const ingredientParts = ingredientLower.split(/[' '-]/g);
            const tagParts =
                tagLower.length > 1 ? tagLower.split(/[' '-]/g) : [tagLower];
            let result = false;
            ingredientParts.some((part, index) => {
                return tagParts.some((tagPart) => {
                    const distance = levenshteinDistance(part, tagPart);
                    result = distance <= part.length / 2.2;
                    if (part.includes(tagParts[index])) {
                        const str = part.replace(tagParts[index], '');
                        result = tagParts[index].length > str.length;
                    }
                    if (result) return true;
                    return false;
                });
            });
            return result;
        });
    });
};

export const fetchRecipes = createAsyncThunk(
    'allRecipes/fetchRecipes',
    async function (uid: string | null, { rejectWithValue }) {
        try {
            const dbRef = ref(getDatabase());
            const responseRecipe = await get(child(dbRef, 'dishes'));

            if (!responseRecipe.exists()) {
                throw new Error('Наразі на сайті немає рецептів.');
            }

            const originalData: Recipe[] = await responseRecipe.val();
            const transformRecepiesToArr: Recipe[] = [];

            if (uid) {
                const responseFavoritesId = await get(
                    child(dbRef, `favorites/${uid}`)
                );
                const favoriteId: string[] = await responseFavoritesId.val();

                if (favoriteId) {
                    Object.entries(originalData).forEach((item) => {
                        item[1].favorites = false;
                        favoriteId.forEach((favoriteId) => {
                            if (item[1].id === favoriteId) {
                                item[1].favorites = true;
                            }
                        });
                    });
                }
            }

            Object.entries(originalData).forEach((item) => {
                transformRecepiesToArr.push(item[1]);
            });

            return {
                recipes: transformRecepiesToArr,
                originalFetchedRecepies: originalData,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue(error);
        }
    }
);

export const fetchRecipe = createAsyncThunk(
    'recepiesList/fetchRecipe',
    async function (id: number | string | undefined, { rejectWithValue }) {
        try {
            const dbRef = ref(getDatabase());
            const response = await get(child(dbRef, `dishes/${id}`));

            if (!response.exists()) throw new Error('Something went wrong');
            const data: Recipe = await response.val();
            return data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

export const postRecipe = createAsyncThunk(
    'recepiesList/postRecipe',
    async function (newRecepie: Recipe, { rejectWithValue }) {
        try {
            const db = getDatabase();
            const newPostKey = push(child(ref(db), 'dishes')).key;
            const postData = { ...newRecepie, id: newPostKey };

            const updates: any = {};
            updates[`/dishes/${newPostKey}`] = postData;

            update(ref(db), updates);
            return postData;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

export const updateRecipe = createAsyncThunk(
    'recepiesList/updateRecipe',
    async function (recipeInfo: Recipe, { rejectWithValue }) {
        try {
            const db = getDatabase();
            const recipeId = recipeInfo.id;

            const updates: any = {};
            updates[`/dishes/${recipeId}`] = { ...recipeInfo };

            update(ref(db), updates).catch((error: unknown) => {
                alert('Щось пішло не так, спробуйте ще раз');
            });
            return recipeInfo;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

export const deleteRecipe = createAsyncThunk(
    'recepiesList/deleteRecipe',
    async function (id: string | number, { rejectWithValue }) {
        try {
            const db = getDatabase();
            const itemRef = ref(db, `/dishes/${id}`);
            const favoritesRef = ref(db, `favorites`);
            remove(itemRef).catch((error: unknown) => {
                alert('Щось пішло не так, спробуйте ще раз');
            });
            get(favoritesRef).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const userData = childSnapshot.val(); // Данные пользователя
                        const userId = childSnapshot.key; // ID пользователя
                        if (
                            userData &&
                            userData.some((data: string) => data === id) &&
                            userId
                        ) {
                            const userDishesRef = ref(
                                db,
                                `/favorites/${userId}/${userData.indexOf(id)}`
                            );
                            remove(userDishesRef).catch((error) => {
                                alert('Щось пішло не так, спробуйте ще раз');
                            });
                        }
                    });
                }
            });
            return true;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

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
        setFavoriteRecipes: (
            state,
            action: PayloadAction<IsFavoritePayload>
        ) => {
            const { recipeId, isFavorite } = action.payload;
            state.filteredRecipes = [
                ...state.filteredRecipes.map((recipe) => {
                    if (recipe.id === recipeId) {
                        recipe.favorites = isFavorite;
                    }
                    return recipe;
                }),
            ];
            state.recipes = [
                ...state.recipes.map((recipe) => {
                    if (recipe.id === recipeId) {
                        recipe.favorites = isFavorite;
                    }
                    return recipe;
                }),
            ];
        },
        resetLoadingForm: (state) => {
            state.loadingForm = 'idle';
        },
        filterRecipes: (state, action: PayloadAction<PayloadActionFilter>) => {
            const { searchInput, searchTags, searchCategories } =
                action.payload;

            state.filteredRecipes = JSON.parse(JSON.stringify(state.recipes));
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
                state.filteredRecipes = state.filteredRecipes
                    .filter(
                        (recipe) =>
                            recipe.title
                                .toLowerCase()
                                .indexOf(searchInput.toLowerCase()) > -1
                    )
                    .filter((recipe) => {
                        return filterByIngredients(recipe, searchTags);
                    })
                    .filter(
                        (recipe) =>
                            searchCategories.includes(recipe.category) === true
                    );
            } else if (searchInput && searchTags.length > 0) {
                state.filteredRecipes = state.filteredRecipes
                    .filter(
                        (recipe) =>
                            recipe.title
                                .toLowerCase()
                                .indexOf(searchInput.toLowerCase()) > -1
                    )
                    .filter((recipe) => {
                        return filterByIngredients(recipe, searchTags);
                    });
            } else if (searchInput && searchCategories.length > 0) {
                state.filteredRecipes = state.filteredRecipes
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
                state.filteredRecipes = state.filteredRecipes
                    .filter((recipe) => {
                        return filterByIngredients(recipe, searchTags);
                    })
                    .filter(
                        (recipe) =>
                            searchCategories.includes(recipe.category) === true
                    );
            } else if (searchInput) {
                state.filteredRecipes = state.filteredRecipes.filter(
                    (recipe) =>
                        recipe.title
                            .toLowerCase()
                            .indexOf(searchInput.toLowerCase()) > -1
                );
            } else if (searchTags.length > 0) {
                state.filteredRecipes = state.filteredRecipes.filter(
                    (recipe) => {
                        return filterByIngredients(recipe, searchTags);
                    }
                );
            } else {
                state.filteredRecipes = state.filteredRecipes.filter(
                    (recipe) =>
                        searchCategories.includes(recipe.category) === true
                );
            }
        },
        resetRecipes: (state) => {
            state.recipes = [];
            state.filteredRecipes = [];
            state.recipe = null;
        },
        localRemoveRecipe: (state, action: PayloadAction<string | number>) => {
            state.recipes = state.recipes.filter(
                (recipe) => recipe.id !== action.payload
            );
            state.filteredRecipes = state.filteredRecipes.filter(
                (recipe) => recipe.id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRecipe.pending, (state) => {
            state.loadingRecipe = 'pending';
            state.error = null;
        });
        builder.addCase(
            fetchRecipe.fulfilled,
            (state, action: PayloadAction<Recipe>) => {
                state.loadingRecipe = 'succeeded';
                state.recipe = action.payload;
            }
        );
        builder.addCase(
            fetchRecipe.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.loadingRecipe = 'failed';
                state.error = action.payload;
            }
        );
        builder.addCase(postRecipe.pending, (state) => {
            state.loadingForm = 'pending';
            state.error = null;
        });
        builder.addCase(
            postRecipe.fulfilled,
            (state, action: PayloadAction<Recipe>) => {
                state.loadingForm = 'succeeded';
                state.recipes = [...state.recipes, action.payload];
            }
        );
        builder.addCase(
            postRecipe.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.loadingForm = 'failed';
                state.error = action.payload;
            }
        );
        builder.addCase(updateRecipe.pending, (state) => {
            state.loadingForm = 'pending';
            state.error = null;
        });
        builder.addCase(
            updateRecipe.fulfilled,
            (state, action: PayloadAction<Recipe>) => {
                state.loadingForm = 'succeeded';
                state.recipes = [...state.recipes, action.payload];
            }
        );
        builder.addCase(
            updateRecipe.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.loadingForm = 'failed';
                state.error = action.payload;
            }
        );
        builder.addCase(fetchRecipes.pending, (state) => {
            state.loadingRecipes = 'pending';
            state.error = null;
        });
        builder.addCase(
            fetchRecipes.fulfilled,
            (state, action: PayloadAction<Recipes>) => {
                state.loadingRecipes = 'succeeded';
                state.recipes = action.payload.recipes.reverse();
            }
        );
        builder.addCase(
            fetchRecipes.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.loadingRecipes = 'failed';
                state.error = action.payload;
            }
        );

        builder.addCase(deleteRecipe.pending, (state) => {
            state.removeRecipeLoading = 'pending';
            state.removeRecipeError = null;
        });
        builder.addCase(deleteRecipe.fulfilled, (state) => {
            state.removeRecipeLoading = 'succeeded';
        });
        builder.addCase(
            deleteRecipe.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.removeRecipeLoading = 'failed';
                state.removeRecipeError = action.payload;
            }
        );
    },
});

export const {
    addNewRecipe,
    setFavoriteRecipes,
    setCurrentRecipes,
    filterRecipes,
    setCurrentFilteredRecipes,
    resetLoadingForm,
    resetRecipes,
    localRemoveRecipe,
} = recepieListSlice.actions;

export default recepieListSlice.reducer;
