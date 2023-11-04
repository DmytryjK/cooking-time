import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, get } from '@firebase/database';
import { IngredientsType, Loading } from '../../types/type';

type InitialStateType = {
    tags: IngredientsType[];
    categories: string[];
    loading: Loading;
    error: unknown;
};

const initialState: InitialStateType = {
    tags: [],
    categories: [],
    loading: 'idle',
    error: null,
};

export const getCategories = createAsyncThunk(
    'createRecipeForm/getCategories',
    async function (_, { rejectWithValue }) {
        try {
            const db = getDatabase();
            const userRef = ref(db, `Categories/`);

            const snapshot = await get(userRef);
            const categories: string[] = [];
            if (snapshot.exists()) {
                categories.push(...snapshot.val());
            }
            return categories;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

export const createRecipeFormSlice = createSlice({
    name: 'createRecipeForm',
    initialState,
    reducers: {
        addIngredientTags: (state, action: PayloadAction<IngredientsType>) => {
            state.tags = [...state.tags, action.payload];
        },
        deleteIngredientTags: (
            state,
            action: PayloadAction<string | number>
        ) => {
            state.tags = state.tags.filter((tag) => tag.id !== action.payload);
        },
        updateIngredientInfoById: (
            state,
            action: PayloadAction<IngredientsType>
        ) => {
            let currentIndexOfIngredient = null;
            state.tags.forEach((tag, index) => {
                if (tag.id === action.payload.id) {
                    currentIndexOfIngredient = index;
                }
            });
            if (currentIndexOfIngredient !== null) {
                state.tags = [
                    ...state.tags.slice(0, currentIndexOfIngredient),
                    { ...action.payload },
                    ...state.tags.slice(currentIndexOfIngredient + 1),
                ];
            }
        },
        clearAllTags: (state) => {
            state.tags = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state) => {
            state.loading = 'pending';
            state.error = null;
        });
        builder.addCase(
            getCategories.fulfilled,
            (state, action: PayloadAction<string[]>) => {
                state.categories = action.payload;
                state.loading = 'succeeded';
            }
        );
        builder.addCase(
            getCategories.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.loading = 'failed';
                state.error = action.payload;
            }
        );
    },
});

export const {
    addIngredientTags,
    deleteIngredientTags,
    updateIngredientInfoById,
    clearAllTags,
} = createRecipeFormSlice.actions;

export default createRecipeFormSlice.reducer;
