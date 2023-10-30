import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { tagsType } from '../../types/type';

type TypeFilterRecipes = {
	searchInput: string;
	searchTags: tagsType[];
	searchCategories: string[];
	// searchedNameOfDishes: string;
}

const initialState: TypeFilterRecipes = {
	searchInput: '',
	// searchedNameOfDishes: '',
	searchTags: [],
	searchCategories: [],
}

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		searchInputValue: (state, action: PayloadAction<string>) => {
			state.searchInput = action.payload;
		},
		activeCategories: (state, action: PayloadAction<string[]>) => {
			state.searchCategories = action.payload;
		},
		addSearchTag: (state, action: PayloadAction<tagsType>) => {
			state.searchTags = [...state.searchTags, action.payload];
		},
		deleteSearchTag: (state, action: PayloadAction<string | number>) => {
			const id = action.payload;
			state.searchTags = state.searchTags.filter(tag => tag.id !== id);
		},
		deleteAllTags: (state) => {
			state.searchTags = [];
		},
	}
})

export const { addSearchTag, deleteSearchTag, deleteAllTags, activeCategories, searchInputValue } = filtersSlice.actions;

export default filtersSlice.reducer;
