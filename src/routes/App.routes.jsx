import React from 'react';
import { useSelector } from 'react-redux';
import { useRoutes, Navigate } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import * as Pages from '../pages';

function AppRoutes() {
	const { isAuth } = useSelector((state) => state.auth);

	const routes = useRoutes([
		{
			element: <PrivateRoutes isAuthenticated={isAuth} />,
			children: [
				{
					path: '/',
					element: <Pages.Home />,
				},
			],
		},
		{
			element: <PublicRoutes isAuthenticated={isAuth} />,
			children: [
				{
					path: '/auth/*',
					element: <Pages.Auth />,
				},
				{
					path: '*',
					element: <Navigate to='/' replace={true} />,
				},
			],
		},
	]);

	return routes;
}

export default AppRoutes;
