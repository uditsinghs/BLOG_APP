import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axios";

export const fetchUserProfile = createAsyncThunk("users/fetchProfile", async () => {
  const { data } = await axiosInstance.get("users/profile");
  return data.user;
});

const initialState = {
  isAuthenticated: false,
  user: null,

}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

    },
    updateUserBio: (state, action) => {
      state.user = state.user.bio = action.payload;
    },
    updateUserPhoto: (state, action) => {
      state.user = state.user.photo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, () => {

      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;

      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;

      });
  },
})

export const { login, logout, setUser, updateUserBio, updateUserPhoto } = userSlice.actions;
export default userSlice.reducer;



