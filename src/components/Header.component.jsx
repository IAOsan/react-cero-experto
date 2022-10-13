import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthState, logout } from '../store/auth/auth.slice';
import useActions from '../hooks/useActions';
import { ExitIcon } from '../constants/icons';
import Navbar from './common/Navbar.component';

function Header() {
	const { user } = useSelector(selectAuthState);
	const actions = useActions({ logout });

	return (
		<header>
			<Navbar
				brand={{
					label: user.name,
				}}
				content={() => (
					<button
						onClick={() => actions.logout()}
						className='btn btn-danger'
						type='button'
					>
						<ExitIcon className='icon me-2' />
						Exit
					</button>
				)}
			/>
		</header>
	);
}

export default Header;
