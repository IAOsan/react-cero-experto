import { combineReducers } from '@reduxjs/toolkit';
import notesReducer from './slices/notes/notes.slice';

export default combineReducers({
	notes: notesReducer,
});
