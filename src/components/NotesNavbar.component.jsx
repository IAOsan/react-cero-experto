import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addImageToNote, updateNote } from '../store/slices/notes/notes.slice';

function NotesNavbar() {
	const [image, setImage] = useState(null);
	const dispatch = useDispatch();
	const { active } = useSelector((state) => state.entities.notes);
	const { createdAt } = active || {};

	function handleUploadImage() {
		document.getElementById('file_selector').click();
	}

	function handleChangeFile({ target: { files } }) {
		if (!files.length) return;
		const [image] = files;
		setImage(image);
		dispatch(addImageToNote(image));
	}

	function handleSave() {
		dispatch(updateNote({ ...active, file: image }));
	}

	return (
		<nav className='bg-primary shadow-22 text-light w-100 flex flex-ai-c flex-jc-sb notes__navbar'>
			<p>{generateNoteDate(createdAt)}</p>
			<input
				style={{
					display: 'none',
				}}
				type='file'
				id='file_selector'
				onChange={handleChangeFile}
				accept='image/*'
			/>
			<div className='spacing-x-8'>
				<button
					onClick={handleUploadImage}
					className='btn btn--default btn--primary'
					type='button'
				>
					Picture
				</button>
				<button
					onClick={handleSave}
					className='btn btn--default btn--primary'
					type='button'
				>
					Save
				</button>
			</div>
		</nav>
	);
}

export function generateNoteDate(timeStamp) {
	const date = new Date(timeStamp);
	return date.toDateString();
}

export default NotesNavbar;
