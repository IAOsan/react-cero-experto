import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FormInput from './FormInput.component';
import Spinner from './Spinner.component';
import { getClasName } from '../../constants/utils';

function Form({
	title,
	fields,
	submitLabel,
	disableSubmit,
	content,
	action,
	isLoading,
	customFormClass,
	customSubmitClass,
	onSubmit,
}) {
	const formClassname = getClasName(
		{ [customFormClass]: !!customFormClass },
		{ 'card shadow p-5': !customFormClass }
	);
	const submitClassname = getClasName(
		{ [customSubmitClass]: !!customSubmitClass },
		{ 'btn btn-primary btn-lg d-block w-100': !customSubmitClass }
	);

	return (
		<form onSubmit={onSubmit} className={formClassname}>
			{title && <h2 className='mb-4'>{title}</h2>}

			{fields.map((f, idx) => {
				if (f.component) return f.component;
				return <FormInput key={f.id || idx} {...f} />;
			})}

			<button
				className={submitClassname}
				type='submit'
				disabled={disableSubmit}
			>
				{isLoading && <Spinner sm customClassname='me-2' />}
				<span>{submitLabel}</span>
			</button>

			{content && content()}

			{action && (
				<p className='pt-4'>
					{action.desc}
					<Link
						to={action.path}
						className='mx-2 text-decoration-none'
					>
						{action.label}
					</Link>
				</p>
			)}
		</form>
	);
}

Form.propTypes = {
	title: PropTypes.string,
	fields: PropTypes.array.isRequired,
	submitLabel: PropTypes.string,
	disableSubmit: PropTypes.bool,
	content: PropTypes.func,
	customFormClass: PropTypes.string,
	action: PropTypes.shape({
		desc: PropTypes.string.isRequired,
		path: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	}),
	onSubmit: PropTypes.func.isRequired,
};

Form.defaultProps = {
	fields: [],
	submitLabel: 'Submit',
	disableSubmit: false,
};

export default Form;
