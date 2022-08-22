import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as notesService from '../../../services/notes.service';
import * as imagesService from '../../../services/images.service';
import { convertFileToBase64 } from '../../../constants/utils';

const initialState = {
	list: [],
	active: null,
};

const slice = createSlice({
	name: '[notes]',
	initialState,
	reducers: {
		note_added(state, { payload }) {
			state.list.push(payload);
		},
		note_updated(state, { payload }) {
			const { id } = state.active;
			state.list = state.list.map((n) =>
				n.id === id ? { ...n, ...payload } : n
			);
		},
		note_changed(state, { payload }) {
			state.active = {
				...state.active,
				...payload,
			};
		},
		note_removed(state, { payload }) {
			state.list = state.list.filter((n) => n.id !== payload);
			state.active = null;
		},
		note_selected(state, { payload }) {
			const activeNote = state.list.find((n) => n.id === payload);
			state.active = activeNote;
		},
		notes_loaded(state, { payload }) {
			state.list = payload;
		},
		notes_cleared(state) {
			Object.keys(initialState).forEach((k) => {
				state[k] = initialState[k];
			});
		},
	},
});

export default slice.reducer;

const {
	note_added,
	note_changed,
	note_updated,
	note_selected,
	notes_loaded,
	note_removed,
	notes_cleared,
} = slice.actions;

export const addNote = async (dispatch, getState) => {
	try {
		const { uid } = getState().auth.user;
		const note = await notesService.addNewNote(uid);
		dispatch(note_added(note));
		dispatch(note_selected(note.id));
	} catch (error) {
		toast.error(error);
	}
};

export const changeNote = note_changed;

export const updateNote = (note) => async (dispatch, getState) => {
	try {
		const { uid } = getState().auth.user;

		if (note.file) {
			const meta = await imagesService.uploadImage(note.file);
			Object.assign(note, { imageUrl: meta.secure_url });
			delete note.file;
		}

		await notesService.updateNote(uid, note);
		dispatch(note_updated(note));
		toast.success('👏 Note saved!');
	} catch (error) {
		toast.error(error);
	}
};

export const selectNote = note_selected;

export const loadNotes = (uid) => async (dispatch) => {
	try {
		const notes = await notesService.getNotes(uid);
		dispatch(notes_loaded(notes));
	} catch (error) {
		toast.error(error);
	}
};

export const addImageToNote = (file) => async (dispatch) => {
	const base64 = await toast.promise(convertFileToBase64(file), {
		pending: 'Adding image, please wait...',
		success: 'Image added 👌',
		error: 'Sorry, the image could not be added 🤯, try uploading another one or try again later',
	});
	dispatch(note_changed({ imageUrl: base64 }));
};

export const removeNote = (id) => async (dispatch, getState) => {
	try {
		const { uid } = getState().auth.user;
		await notesService.removeNote(uid, id);
		dispatch(note_removed(id));
		toast.success('👍 Note removed!');
	} catch (error) {
		toast.error(error);
	}
};

export const clearNotes = notes_cleared();
