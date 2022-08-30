import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderWithProviders, setupUser } from '../test-utils';
import Login from '../../pages/Login.page';
import {
	loginWithGoogle,
	loginWithEmailPassWord,
} from '../../store/slices/auth/auth.slice';

vi.mock('../../store/slices/auth/auth.slice', async () => {
	const org = await vi.importActual('../../store/slices/auth/auth.slice');

	return {
		...org,
		loginWithGoogle: vi.fn(),
		loginWithEmailPassWord: vi.fn(() => vi.fn()),
	};
});

const user = setupUser();

describe('<Login > page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should renders correctly', () => {
		const wrapper = renderLogin();
		// snapshot
		expect(wrapper.container.firstElementChild).toMatchSnapshot();
		// title
		expect(wrapper.getByText(/log in/i)).toBeInTheDocument();
		// login with social
		expect(
			wrapper.getByText(/Login with social networks/i)
		).toBeInTheDocument();
		// google btn
		expect(
			wrapper.getByRole('button', { name: /sign in with google/i })
		).toBeInTheDocument();
		// footer to register
		expect(wrapper.getByText(/Need an account?/i)).toBeInTheDocument();
		expect(
			wrapper.getByRole('link', { name: /register/i })
		).toBeInTheDocument();
	});
	it('should be able to login with email and password', async () => {
		const userData = {
			email: 'test@mail.com',
			password: '123456',
		};
		const wrapper = renderLogin();

		await user.type(wrapper.getByPlaceholderText(/email/i), userData.email);
		await user.type(
			wrapper.getByPlaceholderText(/password/i),
			userData.password
		);
		await user.keyboard('{Enter>1}');

		expect(loginWithEmailPassWord).toHaveBeenCalledWith(userData);
	});
	it('should be able to login with google', async () => {
		const wrapper = renderLogin();

		await user.click(wrapper.getByText(/Sign in with Google/i));

		expect(loginWithGoogle).toHaveBeenCalled();
	});
	it('should redirects to register page when clicks link', async () => {
		const wrapper = renderLogin();

		await user.click(wrapper.getByRole('link', { name: /REGISTER/i }));

		expect(wrapper.queryByText(/log in/i)).toBeNull();
		expect(wrapper.queryByRole('button', { name: /login/i })).toBeNull();
	});
});

function renderLogin(entries = ['/auth/login']) {
	return renderWithProviders(
		<MemoryRouter initialEntries={entries}>
			<Routes>
				<Route path='/auth/login' element={<Login />} />
				<Route path='/auth/register' element={<mock-register />} />
			</Routes>
		</MemoryRouter>
	);
}
