import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  authChecked: false,
  error: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload ?? false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.authChecked = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.authChecked = true;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.authChecked = true;
    },
  },
});

export const { setLoading, setUser, setError, setLogout, setAuthChecked } =
  authSlice.actions;
export default authSlice.reducer;
