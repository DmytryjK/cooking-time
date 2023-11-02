import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IngredientsType } from '../../types/type'


type TagsType = {
    tags: IngredientsType[],
}

const initialState: TagsType = {
    tags: [],
}

export const createRecipeFormSlice = createSlice({
	name: 'createRecipeForm',
	initialState,
	reducers: {
		addIngredientTags: (state, action: PayloadAction<IngredientsType>) => {
			state.tags = [...state.tags, action.payload];
		},
		deleteIngredientTags: (state, action: PayloadAction<string | number>) => {
			state.tags = state.tags.filter(tag => tag.id !== action.payload);
		},
		updateIngredientInfoById: (state, action: PayloadAction<IngredientsType>) => {
			let currentIndexOfIngredient = null;
			state.tags.forEach(((tag, index) => {
				if (tag.id === action.payload.id) {
					currentIndexOfIngredient = index;
				}
			}))
			if (currentIndexOfIngredient !== null) {
				state.tags = [
					...state.tags.slice(0, currentIndexOfIngredient),
					{...action.payload},
					...state.tags.slice(currentIndexOfIngredient + 1),
				];
			}
		},
		clearAllTags: (state) => {
			state.tags = [];
		},
		setAllIngredients: (state, action: PayloadAction<IngredientsType[]>) => {
			state.tags = action.payload;
		},
	}
})

export const { addIngredientTags, deleteIngredientTags, updateIngredientInfoById, clearAllTags, setAllIngredients } = createRecipeFormSlice.actions;

export default createRecipeFormSlice.reducer;
