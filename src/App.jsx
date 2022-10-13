import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { selectAuthState, checkAuth } from './store/auth/auth.slice';
import useActions from './hooks/useActions';
import AppRoutes from './routes/AppRoutes';
import Spinner from './components/common/Spinner.component';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
	const { isAuth, checking } = useSelector(selectAuthState);
	const actions = useActions({ checkAuth });

	useEffect(() => {
		actions.checkAuth();
	}, [actions]);

	if (checking) {
		return (
			<div className='d-flex justify-content-center align-items-center py-5 my-5'>
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<AppRoutes isAuth={isAuth} />
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>
		</>
	);
}

export default App;
