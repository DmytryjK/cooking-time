import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { filterRecepies, objectForFiltered, objectForSearch, Recepie, tagsType } from '../../types/type';

const initialState: filterRecepies = {
	filteredRecepies: [],
	searchInput: '',
	searchTags: []
}

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		cloneRecepies: (state, action: PayloadAction<Recepie[]>) => {
			state.filteredRecepies = [...action.payload];
		},
		searchInputValue: (state, action: PayloadAction<string>) => {
			state.searchInput = action.payload;
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
		filterRecepiesByTag: (state, action: PayloadAction<objectForFiltered>) => {
			const {recepies, tags} = action.payload;
			state.filteredRecepies = [...recepies];

			if (tags.length > 0) {
            	state.filteredRecepies = state.filteredRecepies.filter(item => item.ingredients?.some(i => tags.includes(i)));
			} 
		},
		filterRecepiesByName: (state, action: PayloadAction<objectForSearch>) => {
			const {recepies, value} = action.payload;
			state.filteredRecepies = [...recepies];
			
			if (value) {
				state.filteredRecepies = state.filteredRecepies.filter(item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1)
			} 
		}

	}
})

export const { filterRecepiesByTag, filterRecepiesByName, cloneRecepies, addSearchTag, deleteSearchTag, deleteAllTags } = filtersSlice.actions;

export default filtersSlice.reducer;
