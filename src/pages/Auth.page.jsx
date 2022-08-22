import React from 'react';
import AuthRoutes from '../routes/Auth.routes';

export function Auth() {
	return (
		<main className='flex flex-ai-c flex-jc-c page'>
			<div className='bg-light auth__box-form anima-fade-in-bottom'>
				<AuthRoutes />
			</div>
		</main>
	);
}

export default Auth;
