import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	loginWithEmailPassWord,
	loginWithGoogle,
} from '../store/slices/auth/auth.slice';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import { loginSchema } from '../validation/schemas';

export function Login() {
	const { formData, errors, handleSubmit, handleChange } = useForm(
		{
			email: '',
			password: '',
		},
		loginSchema,
		doSubmit
	);
	const { isLoading, error } = useSelector((state) => state.ui);
	const dispatch = useDispatch();
	const someInputsAreEmpty = Object.keys(formData).some((k) => !formData[k]);
	const disableSubmit = someInputsAreEmpty || isLoading;

	function doSubmit() {
		dispatch(loginWithEmailPassWord(formData));
	}

	return (
		<Form
			title='Log in'
			fields={[
				{
					type: 'text',
					name: 'email',
					id: 'inputEmail',
					placeholder: 'Email',
					value: formData.email,
					onChange: handleChange,
					error: errors.email || error?.email,
				},
				{
					type: 'password',
					name: 'password',
					id: 'inputPassword',
					placeholder: 'Password',
					value: formData.password,
					onChange: handleChange,
					error: errors.password || error?.password,
				},
			]}
			submitLabel='Login'
			onSubmit={handleSubmit}
			disableSubmit={disableSubmit}
			isLoading={isLoading}
			action={{
				desc: 'Need an account?',
				path: '/auth/register',
				label: 'REGISTER',
			}}
			content={() => (
				<>
					<hr />
					<p className='text-center text-muted my-12'>
						<strong>Login with social networks</strong>
					</p>
					<button
						onClick={() => dispatch(loginWithGoogle)}
						className='btn google-btn'
						type='button'
					>
						<div className='google-icon-wrapper'>
							<img
								className='google-icon'
								src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
								alt='google button'
							/>
						</div>
						<p className='btn-text'>Sign in with Google</p>
					</button>
				</>
			)}
			customFormClass='form anima-fade-in-bck'
		/>
	);
}

export default Login;
