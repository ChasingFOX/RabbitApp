// Code to initialize global storage

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  arrivalName: '',
  arrivalPosition: {latitude: 0, longitude: 0},
  departureName: '',
  departurePosition: {latitude: 0, longitude: 0},
};
const directionSlice = createSlice({
  name: 'direction',
  initialState,
  reducers: {
    setArrivalName(state, action) {
      state.arrivalName = action.payload.arrivalName;
    },
    setArrivalPosition(state, action) {
      state.arrivalPosition = action.payload.arrivalPosition;
    },
    setDepartureName(state, action) {
      state.departureName = action.payload.departureName;
    },
    setDeparturePosition(state, action) {
      state.departurePosition = action.payload.departurePosition;
    },
  },
  extraReducers: builder => {},
});

export default directionSlice;
