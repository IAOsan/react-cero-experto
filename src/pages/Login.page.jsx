import React from 'react';
import Form from '../components/common/Form.component';

export function LoginPage() {
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
								},
								{
									id: 'inputPassword',
									label: 'Password',
									type: 'password',
									name: 'password',
									placeholder: 'Password',
								},
							]}
							submitLabel='Login'
							action={{
								desc: 'Dont have an account?',
								path: '/sign_up',
								label: 'Sign up',
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

export default LoginPage;
