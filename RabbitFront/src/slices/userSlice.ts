// Code to initialize global storage of User information

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  nickName: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.nickName = action.payload.nickName;
    },
    setName(state, action) {
      state.nickName = action.payload.nanickNameme;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
