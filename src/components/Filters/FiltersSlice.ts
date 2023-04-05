import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Recepie } from '../RecipeList/RecepieListSlice';
import { useAppSelector } from '../../hooks/hooks';
export interface tagsType {
    id: number | string;
    tagText: string;
}

interface filterRecepies {
    filteredRecepies: Recepie[];
}

interface objectForFiltered {
	recepies: Recepie[];
	tags: string[];
}

interface objectForSearch {
	recepies: Recepie[];
	value: string;
}

const initialState: filterRecepies = {
	filteredRecepies: [],
}

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		cloneRecepies: (state, action: PayloadAction<Recepie[]>) => {
			state.filteredRecepies = [...action.payload];
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

export const { filterRecepiesByTag, filterRecepiesByName, cloneRecepies } = filtersSlice.actions;

export default filtersSlice.reducer;
