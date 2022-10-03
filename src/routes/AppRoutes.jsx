import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { HomePage, LoginPage, RegisterPage } from '../pages';

function AppRoutes() {
	const routes = useRoutes([
		{
			path: '/',
			element: <HomePage />,
		},
		{
			path: '/login',
			element: <LoginPage />,
		},
		{
			path: '/sign_up',
			element: <RegisterPage />,
		},
		{
			path: '/*',
			element: <Navigate to='/' replace={true} />,
		},
	]);

	return routes;
}

export default AppRoutes;
