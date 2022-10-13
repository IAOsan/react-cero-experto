import React from 'react';
import { useSelector } from 'react-redux';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import useActions from '../hooks/useActions';
import { loginEmailAndPassword } from '../store/auth/auth.slice';
import { selectUiState } from '../store/ui/ui.slice';
import { loginSchema } from '../validation/schemas';

const FORM_SCHEMA = {
	email: '',
	password: '',
};

export function LoginPage() {
	const { formData, errors, handleChange, handleSubmit } = useForm(
		FORM_SCHEMA,
		loginSchema,
		doSubmit
	);
	const actions = useActions({ loginEmailAndPassword });
	const { status, error } = useSelector(selectUiState);
	const someInputsAreEmpty = Object.keys(formData).some((k) => !formData[k]);
	const isSubmitDisabled = someInputsAreEmpty || status === 'loading';

	async function doSubmit() {
		actions.loginEmailAndPassword(formData);
	}

	return (
		<main className='py-5' data-testid='login-page'>
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-md-9 col-lg-7 col-xl-6'>
						<Form
							title='Login'
							fields={[
								{
									id: 'inputEmail',
									label: 'Email address',
									type: 'email',
									name: 'email',
									placeholder: 'name@example.com',
									value: formData.email,
									onChange: handleChange,
									error: errors.email || error?.login?.email,
								},
								{
									id: 'inputPassword',
									label: 'Password',
									type: 'password',
									name: 'password',
									placeholder: 'Password',
									value: formData.password,
									onChange: handleChange,
									error:
										errors.password ||
										error?.login?.password,
								},
							]}
							submitLabel='Login'
							action={{
								desc: 'Dont have an account?',
								path: '/register',
								label: 'Register',
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

export default LoginPage;
