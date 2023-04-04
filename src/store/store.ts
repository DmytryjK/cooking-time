import { configureStore } from '@reduxjs/toolkit'
import FiltersReducer from '../components/Filters/FiltersSlice';
import RecepiesReducer from '../components/RecipeList/RecepieListSlice';

export const store = configureStore({
  reducer: {
    recepies: RecepiesReducer,
    filters: FiltersReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
