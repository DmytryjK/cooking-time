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

interface PostState {
	loading: 'idle' | 'pending' | 'succeeded' | 'failed';
	error: null | string;
}

const initialState: Recepies & PostState = {
	recepies: [],
	loading: 'idle',
	error: null
}

export const fetchRecepies = createAsyncThunk(
	'recepiesList/fetchRecepies',
	async function() {
		try{
			const response = await fetch('http://localhost:3005/dishes');
			const data: Recepie[] = await response.json();
			return data;
		} catch (error: any) {
			throw(error);
		}
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
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRecepies.pending, (state) => {
			state.loading = 'pending';
			state.error = null;
		})
		builder.addCase(fetchRecepies.fulfilled, (state, action: PayloadAction<Recepie[]>) => {
			state.loading = 'succeeded';
			state.recepies = action.payload;
		})
		builder.addCase(fetchRecepies.rejected, (state) => {
			state.loading = 'failed';
			state.error = 'something went wrong';
		})
	},
})

export const { addNewRecepie, deleteRecepie } = recepieListSlice.actions;

export default recepieListSlice.reducer;
