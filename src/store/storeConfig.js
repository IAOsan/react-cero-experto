import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root.reducer';

export const setupStore = (preloadedState) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
};
