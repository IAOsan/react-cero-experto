import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeNote, removeNote } from '../store/slices/notes/notes.slice';
import useForm from '../hooks/useForm';
import NotesNavbar from './NotesNavbar.component';
import FormInput from './common/FormInput.component';
import { noteSchema } from '../validation/schemas';
import * as icons from '../constants/icons';

function Notes() {
	const { active } = useSelector((state) => state.entities.notes);
	const { formData, resetFormData, handleChange } = useForm(
		{
			title: '',
			body: '',
		},
		noteSchema
	);
	const dispatch = useDispatch();
	const prevActive = useRef();
	const { current: keepsRef } = useRef({ resetFormData });
	const { id, title, body, imageUrl } = active || {};

	useEffect(() => {
		if (id === prevActive.current) return;
		prevActive.current = id;

		keepsRef.resetFormData({
			title: title,
			body: body,
		});
	}, [active, keepsRef, id, title, body]);

	useEffect(() => {
		dispatch(changeNote(formData));
	}, [formData, dispatch]);

	return (
		<section className='notes anima-fade-in-bck'>
			<NotesNavbar />
			<div className='flex notes__body'>
				<FormInput
					placeholder='Some awesome title'
					type='text'
					name='title'
					id='inputTitle'
					customInputClass='form__control form--notes__control'
					value={formData.title}
					onChange={handleChange}
				/>
				<FormInput
					placeholder='What happend today'
					type='textarea'
					name='body'
					id='inputBody'
					customGroupClass='form__group h-100'
					customInputClass='form__control form--notes__control form--notes__textarea h-100'
					onChange={handleChange}
					value={formData.body}
				/>
				{imageUrl && (
					<div className='notes__image-container'>
						<img className='shadow-56' src={imageUrl} alt='' />
					</div>
				)}
				<hr className='my-20' />
				<button
					onClick={() => dispatch(removeNote(id))}
					className='btn btn--default notes__remove-btn'
				>
					<icons.trash className='icon' />
					<span>Remove note</span>
				</button>
			</div>
		</section>
	);
}

export default Notes;
