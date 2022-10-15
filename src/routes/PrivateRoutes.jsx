import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoutes({ isAuth, redirectTo }) {
	if (isAuth) {
		return <Outlet />;
	}
	return <Navigate to={redirectTo} replace />;
}

PrivateRoutes.propTypes = {
	isAuth: PropTypes.bool.isRequired,
	redirectTo: PropTypes.string,
};

export default PrivateRoutes;
