// Code to initialize global storage of wayPoint information

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
  safeWaypointRiskiness: [0, 0],
  safetestWaypointRiskiness: [0, 0],
  shortWaypointRiskiness: [0, 0],
  shortestWaypointRiskiness: [0, 0],
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
    setWaypointRiskiness(state, action) {
      state.safeWaypointRiskiness = action.payload.safeWaypointRiskiness;
      state.safetestWaypointRiskiness =
        action.payload.safetestWaypointRiskiness;
      state.shortWaypointRiskiness = action.payload.shortWaypointRiskiness;
      state.shortestWaypointRiskiness =
        action.payload.shortestWaypointRiskiness;
    },
  },
  extraReducers: builder => {},
});

export default waypointSlice;
