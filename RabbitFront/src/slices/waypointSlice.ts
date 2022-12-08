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
  safeWaypoint: data,
  safetestWaypoint: data,
  shortWaypoint: data,
  shortestWaypoint: data,
};
const waypointSlice = createSlice({
  name: 'direction',
  initialState,
  reducers: {
    setWaypoint(state, action) {
      state.safeWaypoint = action.payload.safeWaypoint;
      state.safetestWaypoint = action.payload.safetestWaypoint;
      state.shortWaypoint = action.payload.shortWaypoint;
      state.shortestWaypoint = action.payload.shortestWaypoint;
    },
    setWaypointChecked(state, action) {
      state.wayPointChecked = action.payload.wayPointChecked;
    },
  },
  extraReducers: builder => {},
});

export default waypointSlice;
