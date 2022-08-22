import React from 'react';
import { Link } from 'react-router-dom';
import FormInput from './FormInput.component';
import Spinner from './Spinner/Spinner.component';
import PropTypes from 'prop-types';

function Form({
	title,
	fields,
	submitLabel,
	disableSubmit,
	content,
	action,
	onSubmit,
	isLoading,
	customFormClass,
}) {
	const formClassname = customFormClass || 'form';

	return (
		<form onSubmit={onSubmit} className={formClassname}>
			{title && (
				<h2 className='heading-2 mb-24 text-primary-alt'>{title}</h2>
			)}
			{fields.map((f, idx) => (
				<FormInput key={idx} {...f} />
			))}
			<button
				className='btn btn--default btn--primary btn--block my-20'
				type='submit'
				disabled={disableSubmit}
			>
				<div className='flex flex-ai-c flex-jc-c'>
					{isLoading && <Spinner size='xs' color='light' inline />}
					{submitLabel}
				</div>
			</button>
			{content && content()}
			{action && (
				<p className='mt-20 text-center'>
					{action.desc}
					<Link to={action.path} className='mx-8 text-underline'>
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
