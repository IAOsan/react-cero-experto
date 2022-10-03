import React from 'react';
import PropTypes from 'prop-types';
import { DeleteIcon } from '../constants/icons';

function FabDeleteEvent({ isVisible, onDelete }) {
	if (!isVisible) return null;

	return (
		<button
			onClick={onDelete}
			className='btn btn-danger rounded-circle fab fab--delete'
			data-testid='delete-evt'
			type='button'
		>
			<span className='sr-only sr-only-focusable'>
				Delete selected event
			</span>
			<DeleteIcon className='icon icon--lg' />
		</button>
	);
}

FabDeleteEvent.propTypes = {
	onDelete: PropTypes.func.isRequired,
	isVisible: PropTypes.bool.isRequired,
};

export default FabDeleteEvent;
