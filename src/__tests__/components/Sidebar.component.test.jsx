import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { renderWithProviders, setupUser } from '../test-utils';
import Sidebar from '../../components/Sidebar.component';
import { addNote } from '../../store/slices/notes/notes.slice';
import { logout } from '../../store/slices/auth/auth.slice';

vi.mock('../../store/slices/auth/auth.slice', async () => {
	const org = await vi.importActual('../../store/slices/auth/auth.slice');
	return {
		...org,
		logout: vi.fn(),
	};
});

vi.mock('../../store/slices/notes/notes.slice', async () => {
	const org = await vi.importActual('../../store/slices/notes/notes.slice');
	return {
		...org,
		addNote: vi.fn(),
	};
});

const userName = 'test user';
const user = setupUser();

describe('<Sidebar />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should renders properly', () => {
		const wrapper = renderSidebar();
		expect(wrapper.container.firstElementChild).toMatchSnapshot();
		expect(wrapper.getByText(userName)).toMatchSnapshot();
		expect(
			wrapper.getByRole('button', { name: /logout/i })
		).toBeInTheDocument();
		expect(
			wrapper.getByRole('button', { name: /new entry/i })
		).toBeInTheDocument();
		expect(wrapper.getByRole('list')).toBeInTheDocument();
	});

	it('should be able to add note when clicks new entry btn', async () => {
		const wrapper = renderSidebar();

		await user.click(wrapper.getByRole('button', { name: /new entry/i }));

		expect(addNote).toHaveBeenCalled();
	});

	it('should logout when clicks logout btn', async () => {
		const wrapper = renderSidebar();

		await user.click(wrapper.getByRole('button', { name: /logout/i }));

		expect(logout).toHaveBeenCalled();
	});
});

function renderSidebar() {
	return renderWithProviders(<Sidebar />, {
		preloadedState: {
			auth: {
				user: {
					name: userName,
				},
				isAuth: true,
			},
		},
	});
}
