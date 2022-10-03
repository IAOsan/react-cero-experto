import React from 'react';
import Form from '../components/common/Form.component';

export function RegisterPage() {
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
								},
								{
									id: 'inputEmail',
									label: 'Email address',
									type: 'email',
									name: 'email',
									placeholder: 'name@example.com',
								},
								{
									id: 'inputPassword',
									label: 'Password',
									type: 'password',
									name: 'password',
									placeholder: 'Password',
								},
								{
									id: 'inputConfirmPassword',
									label: 'Confirm Password',
									type: 'password',
									name: 'confirmPassword',
									placeholder: 'Confirm Password',
								},
							]}
							submitLabel='Login'
							action={{
								desc: 'You are already a user?',
								path: '/login',
								label: 'Login',
							}}
							onSubmit={(e) => {
								e.preventDefault();
								console.log('submit form');
							}}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}

export default RegisterPage;
