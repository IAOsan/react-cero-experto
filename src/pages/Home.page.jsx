import React from 'react';
import { useSelector } from 'react-redux';
import Notes from '../components/Notes.component';
import Sidebar from '../components/Sidebar.component';
import * as icons from '../constants/icons';

export function Home() {
	const { active } = useSelector((state) => state.entities.notes);

	return (
		<main className='page flex bg-primary-700'>
			<Sidebar />
			<div className='home__body'>
				{active ? <Notes /> : <EmptyState />}
			</div>
		</main>
	);
}

function EmptyState() {
	return (
		<div className='flex flex-ai-c flex-jc-c text-center text-light w-100 h-100'>
			<div className='anima-fade-in-right'>
				<icons.star className='icon icon-display-2' />
				<h3 className='heading-3'>¡Nothing selected!</h3>
				<p>Select something or create new entry</p>
			</div>
		</div>
	);
}

export default Home;
