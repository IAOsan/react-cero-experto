import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PublicRoutes({ isAuthenticated }) {
	return isAuthenticated ? <Navigate to='/' /> : <Outlet />;
}

PublicRoutes.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	redirectTo: PropTypes.string,
};

export default PublicRoutes;
