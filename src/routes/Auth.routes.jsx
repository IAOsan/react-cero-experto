import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import * as Pages from '../pages';

function AuthRoutes() {
	const routes = useRoutes([
		{
			path: 'login',
			element: <Pages.Login />,
		},
		{
			path: 'register',
			element: <Pages.Register />,
		},
		{
			path: '*',
			element: <Navigate to='/auth/register' />,
		},
	]);

	return routes;
}

export default AuthRoutes;
