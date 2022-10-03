import React from 'react';
import PropTypes from 'prop-types';
import { getClasName } from '../../constants/utils';

const FormInput = React.forwardRef(
	(
		{
			id,
			label,
			description,
			error,
			component,
			customGroupClass,
			customInputClass,
			...rest
		},
		ref
	) => {
		const groupClassname = getClasName(
			{ [customGroupClass]: !!customGroupClass },
			{ 'form-group mb-4': !customGroupClass }
		);
		const inputClassname = getClasName(
			{ [customInputClass]: !!customInputClass },
			{ 'form-control text-dark': !customInputClass },
			{ 'is-invalid': !!error }
		);

		function renderInput({ type, ...rest }) {
			if (type === 'textarea') return <textarea {...rest}></textarea>;
			return <input type={type} {...rest} />;
		}

		function renderDescription() {
			if (description && !error)
				return (
					<p className='text-muted mx-3 mt-1 mb-0'>
						<small>{description}</small>
					</p>
				);
			return null;
		}

		function renderError() {
			if (error)
				return <p className='text-danger mx-3 mt-1 mb-0'>{error}</p>;
			return null;
		}

		return (
			<div className={groupClassname}>
				<div className='form-floating'>
					{renderInput({
						...rest,
						id,
						className: inputClassname,
						ref,
					})}
					<label htmlFor={id}>{label}</label>
				</div>
				{renderDescription()}
				{renderError()}
			</div>
		);
	}
);

FormInput.propTypes = {
	type: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	label: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	description: PropTypes.string,
	error: PropTypes.string,
	component: PropTypes.element,
	onChange: PropTypes.func,
};

export default FormInput;
