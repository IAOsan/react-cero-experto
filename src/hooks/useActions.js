import { useMemo, useRef } from 'react';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

function useActions(actions) {
	const dispatch = useDispatch();
	const trackValues = useRef(actions);

	return useMemo(() => {
		return bindActionCreators(trackValues.current, dispatch);
	}, [dispatch]);
}

export default useActions;
