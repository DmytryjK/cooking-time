import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TagsType } from "../../types/type";

type TypeFilterRecipes = {
  searchInput: string;
  searchTags: TagsType[];
  searchCategories: string[];
  isResetSearchFileters: boolean;
  // searchedNameOfDishes: string;
};

const initialState: TypeFilterRecipes = {
  searchInput: "",
  // searchedNameOfDishes: '',
  searchTags: [],
  searchCategories: [],
  isResetSearchFileters: false,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    searchInputValue: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    activeCategories: (state, action: PayloadAction<string[]>) => {
      state.searchCategories = action.payload;
    },
    addSearchTag: (state, action: PayloadAction<TagsType>) => {
      state.searchTags = [...state.searchTags, action.payload];
    },
    deleteSearchTag: (state, action: PayloadAction<string | number>) => {
      const id = action.payload;
      state.searchTags = state.searchTags.filter((tag) => tag.id !== id);
    },
    deleteAllTags: (state) => {
      state.searchTags = [];
    },
    setResetFiltersByName: (state, action: PayloadAction<boolean>) => {
      state.isResetSearchFileters = action.payload;
    },
  },
});

export const {
  addSearchTag,
  deleteSearchTag,
  deleteAllTags,
  activeCategories,
  searchInputValue,
  setResetFiltersByName,
} = filtersSlice.actions;

export default filtersSlice.reducer;
