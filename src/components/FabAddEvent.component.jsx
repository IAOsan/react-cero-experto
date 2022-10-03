import React from 'react';
import PropTypes from 'prop-types';

function FabAddEvent({ onAdd }) {
	return (
		<button
			onClick={onAdd}
			className='btn btn-primary rounded-circle fab fab--add'
			data-testid='add-new-evt'
			type='button'
		>
			&#43;
		</button>
	);
}

FabAddEvent.propTypes = {
	onAdd: PropTypes.func.isRequired,
};

export default FabAddEvent;
