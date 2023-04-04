import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Recepie } from '../RecipeList/RecepieListSlice';

interface Filters {
	tags: string[],
	name: string
}

interface filterRecepies {
    filteredRecepies: Recepie[];
}

const initialState: filterRecepies = {
	filteredRecepies: [],
}

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		filterRecepiesByTag: ({filteredRecepies}, action: PayloadAction<Filters>) => {
            filteredRecepies = filteredRecepies.filter(item =>item.ingredients?.some(i => action.payload.tags.includes(i)))
            
		},
		filterRecepiesByName: ({filteredRecepies}, action: PayloadAction<Filters>) => {
            filteredRecepies = filteredRecepies.filter(item => item.title !== action.payload.name)
		}
	}
})

export const { filterRecepiesByTag, filterRecepiesByName } = filtersSlice.actions;

export default filtersSlice.reducer;
