import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { renderWithProviders, setupUser } from '../test-utils';
import Entry, { generateEntryDate } from '../../components/Entry.component';
import { selectNote } from '../../store/slices/notes/notes.slice';

vi.mock('../../store/slices/notes/notes.slice', async () => {
	const org = await vi.importActual('../../store/slices/notes/notes.slice');
	return {
		...org,
		selectNote: vi.fn(() => vi.fn()),
	};
});

const entry = {
	id: 1,
	title: 'title',
	body: 'body',
	createdAt: new Date().toISOString(),
};
const user = setupUser();

describe('generateEntryDate()', () => {
	it('should return an object with day and date formated', () => {
		const date = new Date().toISOString();
		const expectedResult = {
			date: new Date(date).getDate(),
			day: new Date(date).toLocaleDateString('en-US', {
				weekday: 'long',
			}),
		};

		const result = generateEntryDate(date);

		expect(result).toEqual(expectedResult);
	});
});

describe('<Entry />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should renders properly', () => {
		const { date, day } = generateEntryDate(entry.createdAt);

		const wrapper = renderEntry({ ...entry });

		expect(wrapper.container.firstElementChild).toMatchSnapshot();
		expect(wrapper.getByText(entry.title)).toBeInTheDocument();
		expect(wrapper.getByText(entry.body)).toBeInTheDocument();
		expect(wrapper.getByText(day)).toBeInTheDocument();
		expect(wrapper.getByText(date)).toBeInTheDocument();
	});

	it('should renders image if exists', () => {
		Object.assign(entry, { imageUrl: 'https://via.placeholder.com/150C/' });

		renderEntry({ ...entry });

		const imageElement = document.querySelector('.entry__img-box');

		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveStyle(`--bg: url(${entry.imageUrl})`);
	});

	it('should fire selectNote action when clicks on it', async () => {
		const wrapper = renderEntry({ ...entry });

		await user.click(wrapper.getByRole('button'));

		expect(selectNote).toHaveBeenCalledWith(entry.id);
	});
});

function renderEntry(props = {}) {
	return renderWithProviders(<Entry {...props} />);
}
