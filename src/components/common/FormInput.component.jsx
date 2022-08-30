import React from 'react';
import PropTypes from 'prop-types';

function FormInput({ error, customGroupClass, customInputClass, ...rest }) {
	const groupClassname = customGroupClass || 'form__group';
	const inputClassname = customInputClass || 'form__control';

	function renderInput({ type, ...rest }) {
		if (type === 'textarea') return <textarea {...rest}></textarea>;
		return <input type={type} {...rest} />;
	}

	return (
		<div className={groupClassname}>
			{renderInput({ ...rest, className: inputClassname })}
			{error && (
				<small className='text-danger mx-8 d-block'>{error}</small>
			)}
		</div>
	);
}

FormInput.propTypes = {
	type: PropTypes.string,
	name: PropTypes.string.isRequired,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	placeholder: PropTypes.string,
	value: PropTypes.string,
	error: PropTypes.string,
	onChange: PropTypes.func,
};

export default FormInput;
