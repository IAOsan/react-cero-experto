import '@testing-library/jest-dom';
import '../setupTestServer';
import { vi } from 'vitest';
import reducer, {
	initialState,
	note_added,
	note_updated,
	note_changed,
	note_removed,
	note_selected,
	notes_loaded,
	notes_cleared,
	addNote,
	loadNotes,
	updateNote,
	removeNote,
	addImageToNote,
} from '../../store/slices/notes/notes.slice';
import { clearDb } from '../test-utils';
import { setupStore } from '../../store/store.config';
import { createNote, addNewNote } from '../../services/notes.service';
import * as utils from '../../constants/utils';

const testnote = {
	id: 123,
	title: 'title',
	body: 'body',
};
const testuid = 'testuid';
const stateAuth = {
	auth: {
		user: {
			uid: testuid,
		},
	},
};

describe('Notes reducer', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	it('should handle add a note', () => {
		const result = reducer(undefined, note_added(testnote));

		expect(result.list).toHaveLength(1);
		expect(result.list[0]).toEqual(testnote);
	});

	it('should handle update a note', () => {
		const state = {
			list: [testnote],
			active: testnote,
		};
		const newContent = {
			title: 'title updated',
			body: 'body updated',
		};

		const result = reducer(state, note_updated(newContent));

		expect(result.list[0]).toEqual({ ...testnote, ...newContent });
	});

	it('should handle change active note', () => {
		const state = {
			list: [testnote],
			active: testnote,
		};
		const newContent = {
			title: 'title updated',
		};

		const result = reducer(state, note_changed(newContent));

		expect(result.active).toEqual({ ...testnote, ...newContent });
	});

	it('should handle remove a note', () => {
		const state = {
			list: [
				testnote,
				{
					id: 'abc',
					title: 'note 2',
					body: 'note 2',
				},
			],
			active: testnote,
		};

		const result = reducer(state, note_removed('abc'));

		expect(result.list).toHaveLength(1);
		expect(result.list[0]).toEqual(testnote);
	});

	it('should handle select a note', () => {
		const state = {
			list: [testnote],
			active: null,
		};
		const result = reducer(state, note_selected(123));

		expect(result.active).toEqual(testnote);
	});

	it('should handle set loaded notes', () => {
		const notes = [{ id: 1 }, { id: 2 }];
		const result = reducer(undefined, notes_loaded(notes));

		expect(result.list).toHaveLength(2);
		expect(result.list[0]).toEqual(notes[0]);
		expect(result.list[1]).toEqual(notes[1]);
	});

	it('should handle clear the state', () => {
		const state = {
			list: [{ id: 1 }, { id: 2 }, { id: 3 }],
			active: {
				id: 1,
			},
		};
		const result = reducer(state, notes_cleared());

		expect(result).toEqual(initialState);
	});
});

describe('Notes actions', () => {
	beforeEach(async () => {
		await clearDb();
	});

	it('should be able to create new note', async () => {
		const state = stateAuth;
		const store = setupStore(state);

		await store.dispatch(addNote);

		const { list, active } = store.getState().entities.notes;
		expect(list).toHaveLength(1);
		expect(list[0]).toEqual({
			...createNote(),
			id: expect.any(String),
			createdAt: expect.any(String),
		});
		expect(active.id).toBe(list[0].id);
	});

	it('should be able to load all notes', async () => {
		let list;
		const nOfNotes = 4;
		const state = stateAuth;

		await insertNotes(nOfNotes);

		const store = setupStore(state);
		list = store.getState().entities.notes.list;
		expect(list).toHaveLength(0);

		await store.dispatch(loadNotes(testuid));

		list = store.getState().entities.notes.list;
		expect(list).toHaveLength(nOfNotes);
	});

	it('should be able to update note', async () => {
		const noteUpdate = {
			title: 'title updated',
			body: 'body updated',
		};
		const state = stateAuth;
		const store = setupStore(state);

		await store.dispatch(addNote);
		const noteCreated = store.getState().entities.notes.list[0];
		expect(noteCreated).toEqual({
			...createNote(),
			id: expect.any(String),
			createdAt: expect.any(String),
		});

		Object.assign(noteUpdate, { id: noteCreated.id });

		await store.dispatch(updateNote(noteUpdate));
		const noteUpdated = store.getState().entities.notes.list[0];
		expect(noteUpdated).toEqual({
			...noteCreated,
			...noteUpdated,
		});
	});

	it('should be able to update note with image url', async () => {
		const file = new File([], 'image.jpg');
		const noteUpdate = {
			title: 'image added',
			file,
		};
		const state = stateAuth;
		const store = setupStore(state);

		await store.dispatch(addNote);
		const noteCreated = store.getState().entities.notes.list[0];
		expect(noteCreated.imageUrl).toBeFalsy();
		Object.assign(noteUpdate, { id: noteCreated.id });
		await store.dispatch(updateNote(noteUpdate));

		const noteUpdated = store.getState().entities.notes.list[0];
		expect(noteUpdated.imageUrl).toEqual(expect.any(String));
	});
	// TODO refactor
	it('should be able to add image to active note', async () => {
		vi.spyOn(utils, 'convertFileToBase64').mockResolvedValueOnce(
			'imageconvertedtobase64'
		);
		const file = new File([], 'image.jpg');
		const state = {
			entities: {
				notes: {
					active: { id: 1, title: 'some title', body: 'some body' },
				},
			},
		};
		const store = setupStore(state);

		await store.dispatch(addImageToNote(file));

		expect(store.getState().entities.notes.active.imageUrl).toEqual(
			expect.any(String)
		);
	});

	it('should be able to remove a note', async () => {
		const state = stateAuth;
		const store = setupStore(state);

		await store.dispatch(addNote);
		await store.dispatch(addNote);
		expect(store.getState().entities.notes.list).toHaveLength(2);
		const idToRemove = store.getState().entities.notes.list[0].id;
		await store.dispatch(removeNote(idToRemove));

		expect(store.getState().entities.notes.list).toHaveLength(1);
		expect(store.getState().entities.notes.list[0].id !== idToRemove).toBe(
			true
		);
	});
});

async function insertNotes(quantity) {
	for (let i = 0; i < quantity; i++) {
		await addNewNote(testuid);
	}
}
