import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export interface Recepie {
	id?: number | string;
	title?: string;
	time?: number;
	ingredients?: string[];
	img?: string;
}

interface Recepies {
	recepies: Recepie[];
}

const initialState: Recepies = {
	recepies: []
}

export const fetchRecepies = createAsyncThunk(
	'recepiesList/fetchRecepies',
	async function() {
		const response = await fetch('http://localhost:3005/dishes');
		const data = await response.json();
		return data;
	}
)


export const recepieListSlice = createSlice({
	name: 'recepiesList',
	initialState,
	reducers: {
		addNewRecepie: ({recepies}, action: PayloadAction<Recepie>) => {
			const {id, title, time, ingredients, img} = action.payload;
			recepies.push({
				"id": id, 
				"title": title, 
				"time": time, 
				"ingredients": ingredients, 
				"img": img
			})
		},
		deleteRecepie: ({recepies}, action: PayloadAction<Recepie>) => {
			recepies = recepies.filter(item => item.id !== action.payload.id)
		}
	}
})

// fetchingRecepies: ({recepies}, action: PayloadAction<Recepie>) => {

// },
// fetchingRecepies: ({recepies}, action: PayloadAction<Recepie>) => {
	
// },

export const { addNewRecepie, deleteRecepie } = recepieListSlice.actions

export default recepieListSlice.reducer
