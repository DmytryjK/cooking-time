import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

export interface Recepie {
	id: number | string;
	title: string;
	time?: number;
	ingredients?: string[];
	img?: string;
	description?: string;
}

export interface Recepies {
	recepies: Recepie[];
}

interface PostState {
	loading: 'idle' | 'pending' | 'succeeded' | 'failed';
	error: null | unknown;
}

const initialState: Recepies & PostState = {
	recepies: [],
	loading: 'idle',
	error: null
}

export const fetchRecepies = createAsyncThunk(
	'recepiesList/fetchRecepies',
	async function(_, { rejectWithValue }) {
		try {
			const response = await fetch('http://localhost:3005/dishes');

			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			const data: Recepie[] = await response.json();
			return data;
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
		
	}
)

export const delRecepie = createAsyncThunk(
	'recepiesList/delRecepie',
	async function(id: number | string, { rejectWithValue, dispatch }) {

		try {
			const response = await fetch(`http://localhost:3005/dishes/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Can`t delete this recepie');
			}
			dispatch(deleteRecepie(id));
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
);

export const postRecepie = createAsyncThunk(
	'recepiesList/postRecepie',
	async function(newRecepie: Recepie, { rejectWithValue, dispatch }) {
		try {
			
			const response = await fetch('http://localhost:3005/dishes/', {
				method: 'POST',
				body: JSON.stringify({...newRecepie}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			})

			if (!response.ok) {
				throw new Error('Can`t delete this recepie');
			}
			
			dispatch(addNewRecepie(newRecepie));
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
);

export const recepieListSlice = createSlice({
	name: 'recepiesList',
	initialState,
	reducers: {
		addNewRecepie: (state, action: PayloadAction<Recepie>) => {
			state.recepies.push(action.payload);
		},
		deleteRecepie: (state, action: PayloadAction<number | string>) => {
			state.recepies = state.recepies.filter(item => item.id !== action.payload);
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
		builder.addCase(fetchRecepies.rejected, (state, action: PayloadAction<unknown>) => {
			state.loading = 'failed';
			state.error = action.payload;
		})
	},
})

export const { addNewRecepie, deleteRecepie } = recepieListSlice.actions;

export default recepieListSlice.reducer;
