import {combineReducers} from 'redux';

import userSlice from '../slices/userSlice';
import directionSlice from '../slices/directionSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  direction: directionSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
