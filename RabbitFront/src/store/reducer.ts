import {combineReducers} from 'redux';

import userSlice from '../slices/userSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
