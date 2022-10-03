import { useMemo } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

function useActions(actions) {
	const dispatch = useDispatch();

	return useMemo(() => {
		return bindActionCreators(actions, dispatch);
	}, [actions, dispatch]);
}

export default useActions;
