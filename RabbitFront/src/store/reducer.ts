import {combineReducers} from 'redux';
import userSlice from '../slices/userSlice';
import directionSlice from '../slices/directionSlice';
import waypointSlice from '../slices/waypointSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  direction: directionSlice.reducer,
  waypoint: waypointSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
