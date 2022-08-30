import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderWithProviders, setupUser, clearAllAcounts } from '../test-utils';
import Register from '../../pages/Register.page';
import { registerWithEmailPassword } from '../../store/slices/auth/auth.slice';

vi.mock('../../store/slices/auth/auth.slice', async () => {
	const org = await vi.importActual('../../store/slices/auth/auth.slice');

	return {
		...org,
		registerWithEmailPassword: vi.fn(() => vi.fn()),
	};
});

const user = setupUser();

describe('<Register /> page', () => {
	beforeEach(async () => {
		await clearAllAcounts();
	});

	it('should renders correctly', () => {
		const wrapper = renderRegister();
		// snapshot
		expect(wrapper.container.firstElementChild).toMatchSnapshot();
		// register btn
		expect(
			wrapper.getByRole('button', { name: /register/i })
		).toBeInTheDocument();
		// footer to register
		expect(wrapper.getByText(/Already a user/i)).toBeInTheDocument();
		expect(
			wrapper.getByRole('link', { name: /login/i })
		).toBeInTheDocument();
	});

	it('should be able to register an user', async () => {
		const userData = {
			name: 'testUser',
			email: 'test@mail.com',
			password: '123456',
			confirmPassword: '123456',
		};

		const wrapper = renderRegister();

		await user.type(wrapper.getByPlaceholderText(/name/i), userData.name);
		await user.type(wrapper.getByPlaceholderText(/email/i), userData.email);
		await user.type(
			wrapper.getByPlaceholderText('Password'),
			userData.password
		);
		await user.type(
			wrapper.getByPlaceholderText('Confirm Password'),
			userData.confirmPassword
		);
		await user.keyboard('{Enter>1}');

		expect(registerWithEmailPassword).toHaveBeenCalledWith(userData);
	});

	it('should display an error if exists', () => {
		const error = {
			email: 'Access to this account has been temporarily disabled due to many failed login attempts',
		};
		const state = {
			ui: {
				error,
			},
		};
		const wrapper = renderRegister(['/auth/register'], state);

		expect(wrapper.getByText(error.email)).toBeInTheDocument();
	});

	it('should redirects to login page when clicks link', async () => {
		const wrapper = renderRegister();

		await user.click(wrapper.getByRole('link', { name: /LOGIN/i }));

		expect(wrapper.queryByRole('button', { name: /register/i })).toBeNull();
	});
});

function renderRegister(entries = ['/auth/register'], state = {}) {
	return renderWithProviders(
		<MemoryRouter initialEntries={entries}>
			<Routes>
				<Route path='/auth/register' element={<Register />} />
				<Route path='/auth/login' element={<mock-login />} />
			</Routes>
		</MemoryRouter>,
		{
			preloadedState: state,
		}
	);
}
