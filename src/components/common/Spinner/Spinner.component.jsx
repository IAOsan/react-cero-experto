import React from 'react';
import './spinner.styles.css';

function Spinner({ size = 'default', color = 'default', inline }) {
	const sizes = {
		xs: 'lds-ring lds-ring--xs',
		sm: 'lds-ring lds-ring--sm',
		default: 'lds-ring',
	};
	const colors = {
		light: '#f5f5f5',
		default: '#4d4c7d',
	};

	function renderSpinner() {
		const spinner = (
			<div
				style={{ '--c': colors[color] || colors['default'] }}
				className={sizes[size] || sizes['default']}
			>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		);

		return inline ? (
			spinner
		) : (
			<div className='flex flex-jc-c'>{spinner}</div>
		);
	}

	return <>{renderSpinner()}</>;
}

export default Spinner;
