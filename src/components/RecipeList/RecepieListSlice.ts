import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, child, get, push, update } from "firebase/database";

import type { Recepies, Recepie, PostState } from '../../types/type';


const initialState: Recepies & PostState = {
	recepies: [],
	fetchedRecepieInfo: null,
	loading: 'idle',
	loadingForm: 'idle',
	error: null,
}

export const fetchRecepies = createAsyncThunk(
	'recepiesList/fetchRecepies',
	async function(url: string, { rejectWithValue }) {

		try {
			const dbRef = ref(getDatabase());
			const response = await get(child(dbRef, url));

			if (!response.exists()) throw new Error('Something went wrong');

			const originalData: Recepie[] = await response.val();
			const transformRecepiesToArr: Recepie[]= [];

			for (const key in originalData) transformRecepiesToArr.push(originalData[key]);
			return { 
				recepies: transformRecepiesToArr,
				originalFetchedRecepies: originalData
			};
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
		
	}
)

export const fetchRecepie = createAsyncThunk(
	'recepiesList/fetchRecepie',
	async function(id: number | string | undefined, { rejectWithValue }) {
		try {
			const dbRef = ref(getDatabase());
			const response = await get(child(dbRef, 'dishes/' + id));
			
			if (!response.exists()) throw new Error('Something went wrong');
			const data: Recepie = await response.val();
			return data;
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
		
	}
)

export const postRecepie = createAsyncThunk(
	'recepiesList/postRecepie',
	async function(newRecepie: Recepie, { rejectWithValue }) {
		try{
			const db = getDatabase();
			const newPostKey = push(child(ref(db), 'dishes')).key;
			const postData = {...newRecepie, id: newPostKey};

			const updates: any = {};
			updates['/dishes/' + newPostKey] = postData;

			update(ref(db), updates);
			return postData;
		} catch (error: unknown) {
			return rejectWithValue(error);
		}
	}
);

export const addRecepieToFavorites = createAsyncThunk(
	'recepiesList/postRecepie',
	async function({recepiId, userIdAuth}:{recepiId: string|number|null, userIdAuth: string}, { rejectWithValue }) {
		console.log(recepiId, userIdAuth);
		// try{
		// 	const db = getDatabase();
		// 	const newPostKey = push(child(ref(db), 'favorites')).key;
		// 	const postData = { ...currentRecepie };

		// 	const updates: any = {};
		// 	updates['/favorites/' + newPostKey] = postData;

		// 	update(ref(db), updates);
		// 	return postData;
		// } catch (error: unknown) {
		// 	return rejectWithValue(error);
		// }
	}
);

export const recepieListSlice = createSlice({
	name: 'recepiesList',
	initialState,
	reducers: {
		addNewRecepie: (state, action: PayloadAction<Recepie>) => {
			state.recepies.push(action.payload);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRecepies.pending, (state) => {
			state.loading = 'pending';
			state.error = null;
		})
		builder.addCase(fetchRecepies.fulfilled, (state, action: PayloadAction<Recepies>) => {
			state.loading = 'succeeded';
			state.recepies = action.payload.recepies;
		})
		builder.addCase(fetchRecepies.rejected, (state, action: PayloadAction<unknown>) => {
			state.loading = 'failed';
			state.error = action.payload;
		})
		builder.addCase(fetchRecepie.pending, (state) => {
			state.loading = 'pending';
			state.error = null;
		})
		builder.addCase(fetchRecepie.fulfilled, (state, action: PayloadAction<Recepie>) => {
			state.loading = 'succeeded';
			state.fetchedRecepieInfo = action.payload;
		})
		builder.addCase(fetchRecepie.rejected, (state, action: PayloadAction<unknown>) => {
			state.loading = 'failed';
			state.error = action.payload;
		})
		builder.addCase(postRecepie.pending, (state) => {
			state.loadingForm = 'pending';
			state.error = null;
		})
		builder.addCase(postRecepie.fulfilled, (state, action: PayloadAction<Recepie>) => {
			state.loadingForm = 'succeeded';
			state.recepies = [...state.recepies, action.payload];
		})
		builder.addCase(postRecepie.rejected, (state, action: PayloadAction<unknown>) => {
			state.loadingForm = 'failed';
			state.error = action.payload;
		})
	},
})

export const { addNewRecepie } = recepieListSlice.actions;

export default recepieListSlice.reducer;
