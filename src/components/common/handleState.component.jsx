import PropTypes from 'prop-types';

function HandleState({
	isLoading,
	isEmpty,
	isSuccessful,
	hasError,
	config,
	children,
}) {
	const { loadingState, successState, emptyState, errorState } = config;

	if (isLoading) return loadingState();
	if (isEmpty) return emptyState();
	if (hasError) return errorState();
	if (isSuccessful) return successState();

	return children;
}

HandleState.propTypes = {
	isLoading: PropTypes.bool,
	isSuccessful: PropTypes.bool,
	isEmpty: PropTypes.bool,
	hasError: PropTypes.bool,
	config: PropTypes.shape({
		loadingState: PropTypes.func,
		emptyState: PropTypes.func,
		successState: PropTypes.func,
		errorState: PropTypes.func,
	}).isRequired,
	children: PropTypes.any,
};

HandleState.defaultProps = {
	config: {},
};

export default HandleState;
