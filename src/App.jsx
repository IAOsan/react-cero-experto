import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from './store/slices/auth/auth.slice';
import { loadNotes } from './store/slices/notes/notes.slice';
import * as authService from './services/auth.service';
import AppRoutes from './routes/App.routes';
import Spinner from './components/common/Spinner/Spinner.component';
import './styles/app.scss';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const [canRenderContent, setCanRenderContent] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const unObserve = authService.authStateListener(async (user) => {
			if (user) {
				dispatch(login(user));
				dispatch(loadNotes(user.uid));
			}
			setCanRenderContent(true);
		});
		return () => {
			unObserve();
		};
	}, [dispatch]);

	if (!canRenderContent) {
		return (
			<div className='page flex flex-jc-c flex-ai-c bg-primary-700'>
				<Spinner color='light' inline />
			</div>
		);
	}

	return (
		<Router>
			<ToastContainer
				position='top-center'
				autoClose={4500}
				hideProgressBar={false}
				newestOnTop={false}
				theme='colored'
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<AppRoutes />
		</Router>
	);
}

export default App;
