import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PublicRoutes({ isAuth, redirectTo }) {
	if (isAuth) {
		return <Navigate to={redirectTo} replace />;
	}
	return <Outlet />;
}

PublicRoutes.propTypes = {
	isAuth: PropTypes.bool.isRequired,
	redirectTo: PropTypes.string,
};

export default PublicRoutes;
