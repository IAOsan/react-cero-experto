import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { renderWithProviders } from '../test-utils';
import NotesNavbar, {
	generateNoteDate,
} from '../../components/NotesNavbar.component';

const activeNote = {
	title: 'new title :D',
	createdAt: '2022-08-21T22:47:34.493Z',
	file: null,
	body: 'new body\n\nholamundo desde reactasasdasd',
	imageUrl:
		'https://res.cloudinary.com/dflvdlaev/image/upload/v1661202277/zk2o6c2ubozleypnacvb.jpg',
	id: '7O03b76r5dQiK6XP5zBg',
};

describe('generateNoteDate()', () => {
	it('should return an string of the date formated with the date provided', () => {
		const date = Date.now();
		const expectedResult = new Date(date).toDateString();

		const result = generateNoteDate(date);

		expect(result).toBe(expectedResult);
	});
});

describe('<NotesNavbar />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should renders properly', () => {
		vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(
			'2020-06-20T13:37:00.000Z'
		);

		const wrapper = renderNavbar();

		expect(wrapper.container.firstElementChild).toMatchSnapshot();
		expect(
			wrapper.getByText(generateNoteDate(activeNote.createdAt))
		).toBeInTheDocument();
		expect(
			wrapper.getByRole('button', { name: /picture/i })
		).toBeInTheDocument();
		expect(
			wrapper.getByRole('button', { name: /save/i })
		).toBeInTheDocument();
	});
});

function renderNavbar() {
	return renderWithProviders(<NotesNavbar />, {
		preloadedState: {
			entities: {
				notes: {
					active: activeNote,
				},
			},
		},
	});
}
