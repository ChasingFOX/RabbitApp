import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  nickName: '',
  // crime: '',
  // accessToken: '',
  // refreshToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.nickName = action.payload.nickName;
      // state.accessToken = action.payload.accessToken;
      // state.refreshToken = action.payload.refreshToken;
    },
    setName(state, action) {
      state.nickName = action.payload.nanickNameme;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
