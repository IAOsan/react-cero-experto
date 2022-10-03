import { combineReducers } from '@reduxjs/toolkit';
import eventsReducer from './events.slice';

export default combineReducers({
	events: eventsReducer,
});
