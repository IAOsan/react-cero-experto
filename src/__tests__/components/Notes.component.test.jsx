import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderWithProviders, setupUser } from '../test-utils';
import Notes from '../../components/Notes.component';
import {
	changeNote,
	addImageToNote,
	updateNote,
	removeNote,
} from '../../store/slices/notes/notes.slice';

vi.mock('../../store/slices/notes/notes.slice', async () => {
	const org = await vi.importActual('../../store/slices/notes/notes.slice');
	return {
		...org,
		changeNote: vi.fn(() => vi.fn()),
		addImageToNote: vi.fn(() => vi.fn()),
		updateNote: vi.fn(() => vi.fn()),
		removeNote: vi.fn(() => vi.fn()),
	};
});

const user = setupUser();
const activeNote = {
	title: 'title',
	createdAt: '2022-08-21T22:47:34.493Z',
	file: null,
	body: 'body',
	id: '7O03b76r5dQiK6XP5zBg',
};

describe('<Notes />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should be renders correctly', () => {
		const state = {
			entities: {
				notes: {
					active: activeNote,
				},
			},
		};
		const wrapper = renderNotes(state);

		expect(wrapper.container.firstElementChild).toMatchSnapshot();
		expect(wrapper.getByRole('navigation')).toBeInTheDocument();
		expect(
			wrapper.getByPlaceholderText(/some awesome title/i)
		).toBeInTheDocument();
		expect(
			wrapper.getByPlaceholderText(/what happend today/i)
		).toBeInTheDocument();
		expect(wrapper.queryByRole('img')).toBeNull();
		expect(
			wrapper.getByRole('button', { name: /remove note/i })
		).toBeInTheDocument();
	});

	it('should render note image if exists', () => {
		const imageUrl =
			'https://res.cloudinary.com/dflvdlaev/image/upload/v1661202277/zk2o6c2ubozleypnacvb.jpg';
		const state = {
			entities: {
				notes: {
					active: {
						...activeNote,
						imageUrl,
					},
				},
			},
		};
		const wrapper = renderNotes(state);

		const img = wrapper.getByRole('img');
		expect(img).toBeInTheDocument();
		expect(img.src).toBe(imageUrl);
	});

	it('should change active note', async () => {
		const state = {
			entities: {
				notes: {
					active: activeNote,
				},
			},
		};
		const wrapper = renderNotes(state);

		await user.type(
			wrapper.getByPlaceholderText(/some awesome title/i),
			' updated'
		);

		expect(changeNote).toHaveBeenLastCalledWith({
			title: activeNote.title + ' updated',
			body: activeNote.body,
		});
	});

	it('should add an image to active note', async () => {
		renderNotes();
		const file = new File([new ArrayBuffer(1)], 'file.jpg', {
			type: 'image/jpg',
		});

		await user.upload(document.querySelector('#file_selector'), file);

		expect(addImageToNote).toHaveBeenCalledWith(expect.any(File));
	});

	it('should save note', async () => {
		const wrapper = renderNotes();

		await user.click(wrapper.getByRole('button', { name: /save/i }));

		expect(updateNote).toHaveBeenCalled();
	});

	it('should remove active note', async () => {
		const state = {
			entities: {
				notes: {
					active: activeNote,
				},
			},
		};
		const wrapper = renderNotes(state);

		await user.click(wrapper.getByRole('button', { name: /remove note/i }));

		expect(removeNote).toHaveBeenCalledWith(activeNote.id);
	});
});

function renderNotes(state = {}) {
	return renderWithProviders(<Notes />, {
		preloadedState: state,
	});
}
