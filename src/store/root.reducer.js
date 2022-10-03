import { combineReducers } from '@reduxjs/toolkit';
import entitiesReducer from './entities/entities.reducer';
import uiReducer from './ui/ui.slice';
import authReducer from './auth/auth.slice';

export default combineReducers({
	entities: entitiesReducer,
	ui: uiReducer,
	auth: authReducer,
});
