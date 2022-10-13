import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { HomePage, LoginPage, RegisterPage } from '../pages';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

function AppRoutes({ isAuth }) {
	const routes = useRoutes([
		{
			element: <PrivateRoutes isAuthenticated={isAuth} />,
			children: [{ path: '/', element: <HomePage /> }],
		},
		{
			element: <PublicRoutes isAuthenticated={isAuth} />,
			children: [
				{
					path: '/login',
					element: <LoginPage />,
				},
				{
					path: '/register',
					element: <RegisterPage />,
				},
			],
		},
		{
			path: '/*',
			element: <Navigate to='/' replace={true} />,
		},
	]);

	return routes;
}

export default AppRoutes;
