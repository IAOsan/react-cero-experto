import React from 'react';
import { useSelector } from 'react-redux';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import useActions from '../hooks/useActions';
import { registerEmailAndPassword } from '../store/auth/auth.slice';
import { selectUiState } from '../store/ui/ui.slice';
import { registerSchema } from '../validation/schemas';

const FORM_SCHEMA = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

export function RegisterPage() {
	const { formData, errors, handleSubmit, handleChange } = useForm(
		FORM_SCHEMA,
		registerSchema,
		doSubmit
	);
	const actions = useActions({ registerEmailAndPassword });
	const { status, error } = useSelector(selectUiState);
	const someInputsAreEmpty = Object.keys(formData).some((k) => !formData[k]);
	const isSubmitDisabled = someInputsAreEmpty || status === 'loading';

	async function doSubmit() {
		actions.registerEmailAndPassword(formData);
	}

	return (
		<main className='py-5' data-testid='register-page'>
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-md-9 col-lg-7 col-xl-6'>
						<Form
							title='Register'
							fields={[
								{
									id: 'inputName',
									label: 'Name',
									type: 'text',
									name: 'name',
									placeholder: 'Name',
									customInputClass: 'form-control text-dark',
									value: formData.name,
									onChange: handleChange,
									error:
										errors.name || error?.register?.email,
								},
								{
									id: 'inputEmail',
									label: 'Email address',
									type: 'email',
									name: 'email',
									placeholder: 'name@example.com',
									value: formData.email,
									onChange: handleChange,
									error: errors.email,
								},
								{
									id: 'inputPassword',
									label: 'Password',
									type: 'password',
									name: 'password',
									placeholder: 'Password',
									value: formData.password,
									onChange: handleChange,
									error: errors.password,
								},
								{
									id: 'inputConfirmPassword',
									label: 'Confirm Password',
									type: 'password',
									name: 'confirmPassword',
									placeholder: 'Confirm Password',
									value: formData.confirmPassword,
									onChange: handleChange,
									error: errors.confirmPassword,
								},
							]}
							submitLabel='Register'
							action={{
								desc: 'You are already a user?',
								path: '/login',
								label: 'Login',
							}}
							onSubmit={handleSubmit}
							disableSubmit={isSubmitDisabled}
							isLoading={status === 'loading'}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}

export default RegisterPage;
