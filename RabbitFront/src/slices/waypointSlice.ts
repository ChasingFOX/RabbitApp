import {createSlice} from '@reduxjs/toolkit';

const data = [
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
  {latitude: 0, longitude: 0},
];
const initialState = {
  wayPointChecked: [false, false, false, false],
  blueWaypoint: data,
  greenWaypoint: data,
  orangeWaypoint: data,
  redWaypoint: data,
  yellowWaypoint: data,
};
const waypointSlice = createSlice({
  name: 'direction',
  initialState,
  reducers: {
    setWaypoint(state, action) {
      state.wayPointChecked = action.payload.wayPointChecked;
      state.blueWaypoint = action.payload.blueWaypoint;
      state.greenWaypoint = action.payload.greenWaypoint;
      state.orangeWaypoint = action.payload.orangeWaypoint;
      state.redWaypoint = action.payload.redWaypoint;
      state.yellowWaypoint = action.payload.yellowWaypoint;
    },
  },
  extraReducers: builder => {},
});

export default waypointSlice;
