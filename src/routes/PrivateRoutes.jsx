import { Outlet, Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoutes({ isAuthenticated }) {
	const location = useLocation();
	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate
			replace
			to='/auth/login'
			state={{ lastPath: location.pathname }}
		/>
	);
}

PrivateRoutes.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	redirectTo: PropTypes.string,
};

export default PrivateRoutes;
