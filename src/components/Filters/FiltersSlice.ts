import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Recepie } from '../../types/type';
import type {filterRecepies, objectForFiltered, objectForSearch} from '../../types/type';

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
