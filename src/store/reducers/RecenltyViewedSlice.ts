import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatabase, ref, get, child } from "@firebase/database";
import type { Loading, Recipe, RecipesFromServer } from "../../types/type";

type RecentlyViewed = {
  loading: Loading;
  error: unknown;
  recentlyRecipes: Recipe[];
};

const initialState: RecentlyViewed = {
  loading: "idle",
  error: null,
  recentlyRecipes: [],
};

export const fetchRecentlyRecipes = createAsyncThunk(
  "recenltyViewed/fetchRecentlyRecipes",
  async function (recentlyId: string[], { rejectWithValue }) {
    try {
      const dbRef = ref(getDatabase(), "dishes/");
      const response = await get(dbRef);
      if (!response.exists()) throw new Error("Something went wrong");
      const data: RecipesFromServer = await response.val();
      const filteredData = Object.entries(data)
        .map((item) => item[1])
        .filter((item) => recentlyId.some((recentlyId) => recentlyId === item.id));
      return filteredData;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  },
);

export const recenltyViewedSlice = createSlice({
  name: "recenltyViewed",
  initialState,
  reducers: {
    toggleFavoriteRecentlyRecipe: (state, action: PayloadAction<string>) => {
      state.recentlyRecipes = state.recentlyRecipes.map((item) => {
        let recipe = item;
        if (item.id === action.payload) {
          recipe = { ...item, favorites: !item.favorites };
        }
        return recipe;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRecentlyRecipes.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(fetchRecentlyRecipes.fulfilled, (state, action: PayloadAction<Recipe[]>) => {
      state.loading = "succeeded";
      state.recentlyRecipes = action.payload;
    });
    builder.addCase(fetchRecentlyRecipes.rejected, (state, action: PayloadAction<unknown>) => {
      state.loading = "failed";
      state.error = action.payload;
    });
  },
});

export const { toggleFavoriteRecentlyRecipe } = recenltyViewedSlice.actions;

export default recenltyViewedSlice.reducer;
