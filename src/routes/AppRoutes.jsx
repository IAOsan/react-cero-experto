import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { HomePage, LoginPage, RegisterPage } from '../pages';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

function AppRoutes({ isAuth }) {
	return useRoutes([
		{
			element: <PrivateRoutes isAuth={isAuth} redirectTo='/login' />,
			children: [
				{
					path: '/',
					element: <HomePage />,
				},
			],
		},
		{
			element: <PublicRoutes isAuth={isAuth} redirectTo='/' />,
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
			path: '*',
			element: <Navigate to='/' replace={true} />,
		},
	]);
}

export default AppRoutes;
