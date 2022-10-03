import React from 'react';
import PropTypes from 'prop-types';
import { getClasName } from '../../constants/utils';

function Spinner({ sm, customClassname }) {
	const spinnerClassname = getClasName(
		'spinner-border',
		{ 'spinner-border-sm': !!sm },
		{
			[customClassname]: !!customClassname,
		}
	);

	return (
		<div className={spinnerClassname} role='status'>
			<span className='visually-hidden'>Loading...</span>
		</div>
	);
}

Spinner.propTypes = {
	sm: PropTypes.bool,
	customClassname: PropTypes.string,
};

export default Spinner;
