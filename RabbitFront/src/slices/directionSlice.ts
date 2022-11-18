import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  destination: {},
  currentPosition: {},
};
const directionSlice = createSlice({
  name: 'direction',
  initialState,
  reducers: {
    setDirection(state, action) {
      state.destination = action.payload.destination;
      state.currentPosition = action.payload.currentPosition;
    },
  },
  extraReducers: builder => {},
});

export default directionSlice;
