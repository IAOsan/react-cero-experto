import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNote } from '../store/slices/notes/notes.slice';
import { logout } from '../store/slices/auth/auth.slice';
import * as icons from '../constants/icons';
import Entries from './Entries.component';

function Sidebar() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const { list } = useSelector((state) => state.entities.notes);
	const { name } = user || {};

	return (
		<aside className='bg-dark home__sidebar sidebar anima-slide-in-left'>
			<div className='flex flex-ai-c flex-jc-sb'>
				<p>
					<span>
						<icons.moon className='icon mr-8' />
					</span>
					{name}
				</p>
				<button
					onClick={() => dispatch(logout)}
					className='btn btn--default btn--dark'
					type='button'
				>
					Logout
				</button>
			</div>
			<button
				onClick={() => dispatch(addNote)}
				className='btn my-12 text-center sidebar__new-entry'
				type='button'
			>
				<icons.calendar className='icon icon-display-3' />
				<p>New entry</p>
			</button>
			<Entries list={list} />
		</aside>
	);
}

export default Sidebar;
