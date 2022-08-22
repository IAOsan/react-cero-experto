import { combineReducers } from '@reduxjs/toolkit';
import entitiesReducer from './entities.reducer';
import uiReducer from './slices/ui/ui.slice';
import authReducer from './slices/auth/auth.slice';

export default combineReducers({
	entities: entitiesReducer,
	auth: authReducer,
	ui: uiReducer,
});
