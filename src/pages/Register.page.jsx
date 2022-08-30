import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerWithEmailPassword } from '../store/slices/auth/auth.slice';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import { registerSchema } from '../validation/schemas';

export function Register() {
	const { formData, errors, handleSubmit, handleChange } = useForm(
		{
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		registerSchema,
		doSubmit
	);
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector((state) => state.ui);
	const someInputsAreEmpty = Object.keys(formData).some((k) => !formData[k]);
	const disableSubmit = someInputsAreEmpty || isLoading;

	function doSubmit() {
		dispatch(registerWithEmailPassword(formData));
	}

	return (
		<Form
			title='Register'
			fields={[
				{
					type: 'text',
					name: 'name',
					id: 'inputName',
					placeholder: 'Name',
					error: errors.name,
					value: formData.name,
					onChange: handleChange,
				},
				{
					type: 'email',
					name: 'email',
					id: 'inputEmail',
					placeholder: 'Email',
					error: errors.email || error?.email,
					value: formData.email,
					onChange: handleChange,
				},
				{
					type: 'password',
					name: 'password',
					id: 'inputPassword',
					placeholder: 'Password',
					error: errors.password || error?.password,
					value: formData.password,
					onChange: handleChange,
				},
				{
					type: 'password',
					name: 'confirmPassword',
					id: 'inputConfirmPassword',
					placeholder: 'Confirm Password',
					error: errors.confirmPassword,
					value: formData.confirmPassword,
					onChange: handleChange,
				},
			]}
			submitLabel='Register'
			onSubmit={handleSubmit}
			disableSubmit={disableSubmit}
			isLoading={isLoading}
			action={{
				desc: 'Already a user?',
				path: '/auth/login',
				label: 'LOGIN',
			}}
			customFormClass='form anima-fade-in-bck'
		/>
	);
}

export default Register;
