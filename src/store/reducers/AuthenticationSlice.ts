import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserType, User } from "../../types/type";
import { CONFIG } from "../../config";

const initialState: UserType = {
  user: {
    uid: "",
    email: "",
    emailVerified: null,
    isAdmin: false,
  },
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<User>) => {
      state.user = { ...action.payload, isAdmin: false };
      const { email } = state.user;
      const admins = CONFIG.ADMINS_LIST.split(", ");
      if (admins.some((adminMail) => adminMail === email)) {
        state.user.isAdmin = true;
      }
    },
  },
});

export const { createUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
