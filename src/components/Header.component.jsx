import React from 'react';
import Navbar from './common/Navbar.component';
import { ExitIcon } from '../constants/icons';

function Header() {
	return (
		<header>
			<Navbar
				brand={{
					label: 'Pedro',
				}}
				content={() => (
					<button className='btn btn-danger' type='button'>
						<ExitIcon className='icon me-2' />
						Exit
					</button>
				)}
			/>
		</header>
	);
}

export default Header;
