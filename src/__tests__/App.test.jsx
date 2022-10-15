import './testServer/setupTestServer';
import jwt_decode from 'jwt-decode';
import { MemoryRouter } from 'react-router-dom';
import {
	renderWithProviders,
	screen,
	setupUser,
	waitForElementToBeRemoved,
	waitFor,
} from './tests-utils';
import { requestTracker } from './testServer/testServerHandlers';
import storageService from '../services/storage.service';
import { TOKEN_KEY } from '../config';
import { userCredentials, token, authState } from './fixtures';
import App from '../App';

function renderApp(entries = ['/'], preloadedState) {
	renderWithProviders(
		<MemoryRouter initialEntries={entries}>
			<App />
		</MemoryRouter>,
		{
			preloadedState,
		}
	);
}

const user = setupUser();

describe('<App />', () => {
	const homePage = () => screen.queryByTestId('home-page'),
		loginPage = () => screen.queryByTestId('login-page'),
		registerPage = () => screen.queryByTestId('register-page'),
		linkSignUp = () => screen.getByRole('link', { name: /register/i }),
		linkLogin = () => screen.getByRole('link', { name: /login/i }),
		inputName = () => screen.getByLabelText(/name/i),
		inputEmail = () => screen.getByLabelText(/email address/i),
		inputPassword = () => screen.getByLabelText('Password'),
		inputConfirmPassword = () => screen.getByLabelText('Confirm Password'),
		submitRegisterBtn = () =>
			screen.getByRole('button', { name: /register/i }),
		submitLoginBtn = () => screen.getByRole('button', { name: /login/i }),
		spinner = () => screen.queryByText(/loading\.\.\./i),
		logoutBtn = () => screen.queryByRole('button', { name: /exit/i });

	describe('/*== routing ==*/', () => {
		it('should redirects to login page if you are not authenticated', async () => {
			renderApp();

			await waitFor(() => {
				expect(loginPage()).toBeInTheDocument();
			});
		});

		it('should displays login page if you are not authenticated', async () => {
			renderApp(['/login']);
			await waitFor(() => {
				expect(loginPage()).toBeInTheDocument();
			});
		});

		it('should displays register page if you are not authenticated', async () => {
			renderApp(['/register']);
			await waitFor(() => {
				expect(registerPage()).toBeInTheDocument();
			});
		});

		it('should displays home page if you are authenticated', async () => {
			renderApp(['/'], authState);

			await waitFor(() => {
				expect(homePage()).toBeInTheDocument();
			});
		});

		it('should not displays register page if you are authenticated', async () => {
			renderApp(['/register'], authState);

			await waitFor(() => {
				expect(registerPage()).toBeNull();
				expect(homePage()).toBeInTheDocument();
			});
		});

		it('should not displays login page if you are authenticated', async () => {
			renderApp(['/login'], authState);

			await waitFor(() => {
				expect(loginPage()).toBeNull();
				expect(homePage()).toBeInTheDocument();
			});
		});

		it('should displays only home page in the route "/"', async () => {
			renderApp(['/'], authState);

			await waitFor(() => {
				expect(homePage()).toBeInTheDocument();
				expect(loginPage()).toBeNull();
				expect(registerPage()).toBeNull();
			});
		});

		it('should displays only login page in the route "/login"', async () => {
			renderApp(['/login']);

			await waitFor(() => {
				expect(loginPage()).toBeInTheDocument();
				expect(homePage()).toBeNull();
				expect(registerPage()).toBeNull();
			});
		});

		it('should displays only register page in the route "/register"', async () => {
			renderApp(['/register']);

			await waitFor(() => {
				expect(registerPage()).toBeInTheDocument();
				expect(loginPage()).toBeNull();
				expect(homePage()).toBeNull();
			});
		});
	});

	describe('/*== login ==*/', () => {
		async function fillForm(overrides = {}) {
			const { email, password } = {
				email: userCredentials.email,
				password: userCredentials.password,
				...overrides,
			};
			await user.type(inputEmail(), email);
			await user.type(inputPassword(), password);
		}

		beforeEach(() => {
			renderApp(['/login']);
		});

		afterEach(() => {
			storageService.clear();
		});

		it('should displays message for non account', async () => {
			await waitForElementToBeRemoved(spinner());

			expect(
				screen.getByText('Dont have an account?')
			).toBeInTheDocument();
		});

		it('should redirects to signup page when clicks signup link', async () => {
			await waitForElementToBeRemoved(spinner());

			await user.click(linkSignUp());

			await waitFor(() => {
				expect(registerPage()).toBeInTheDocument();
			});
		});

		it('should make a request when form is submitted', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.keyboard('{Enter>1}');

			await waitForElementToBeRemoved(spinner());

			const request = requestTracker[requestTracker.length - 1];
			expect(request.method).toBe('POST');
			expect(request.path).toBe('/api/v1/auth');
		});

		it('should disable submit button when a making request', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.dblClick(submitLoginBtn());

			await waitForElementToBeRemoved(spinner());

			const requests = requestTracker.filter((r) => r.method === 'POST');

			expect(requests[0].path).toBe('/api/v1/auth');
			expect(requests).toHaveLength(1);
		});

		it('should display spinner after clicking submit button', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();

			expect(spinner()).toBeNull();

			await user.click(submitLoginBtn());

			expect(spinner()).toBeInTheDocument();
		});

		it('should hides spinner after request finished', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.click(submitLoginBtn());

			await waitFor(() => {
				expect(spinner()).toBeNull();
			});
		});

		it('should store token after login in local storage', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.keyboard('{Enter>1}');

			await waitForElementToBeRemoved(spinner());

			const token = storageService.getItem('token', '');
			const decoded = jwt_decode(token);

			expect(token).toBeTruthy();
			expect(decoded.name).toBeTruthy();
			expect(decoded.email).toBeTruthy();
			expect(decoded.id).toBeTruthy();
		});

		it('should redirects to home page if you are authenticated', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.keyboard('{Enter>1}');

			await waitForElementToBeRemoved(spinner());

			await waitFor(() => {
				expect(loginPage()).toBeNull();
			});
		});

		describe('validation', () => {
			it('should display and error if user not found', async () => {
				await waitForElementToBeRemoved(spinner());

				await fillForm({
					email: 'user5@mail.com',
					password: 'user5password',
				});
				await user.keyboard('{Enter>1}');

				await waitForElementToBeRemoved(spinner());

				expect(screen.getByText(/user not found/i)).toBeInTheDocument();
			});

			it('should display and error if password password do not match', async () => {
				await waitForElementToBeRemoved(spinner());

				await fillForm({
					email: 'user2@mail.com',
					password: 'user1password',
				});
				await user.keyboard('{Enter>1}');

				await waitForElementToBeRemoved(spinner());

				expect(
					screen.getByText(/password not match/i)
				).toBeInTheDocument();
			});
		});
	});

	describe('/*== logout ==*/', () => {
		beforeEach(() => {
			storageService.setItem(TOKEN_KEY, token);
			renderApp();
		});

		afterEach(() => {
			storageService.clear();
		});

		it('should redirects to login page when clicks logout button', async () => {
			await waitForElementToBeRemoved(spinner());

			await user.click(logoutBtn());

			await waitFor(() => {
				expect(loginPage()).toBeInTheDocument();
			});
		});

		it('should clear token in local storage after clicks logout button', async () => {
			await waitForElementToBeRemoved(spinner());

			await user.click(logoutBtn());

			const token = storageService.getItem(TOKEN_KEY);

			expect(token).toBeUndefined();
		});
	});

	describe('/*== register ==*/', () => {
		async function fillForm(overrides = {}) {
			const { name, email, password, confirmPassword } = {
				name: userCredentials.name,
				email: userCredentials.email,
				password: userCredentials.password,
				confirmPassword: userCredentials.password,
				...overrides,
			};
			await user.type(inputName(), name);
			await user.type(inputEmail(), email);
			await user.type(inputPassword(), password);
			await user.type(inputConfirmPassword(), confirmPassword);
		}

		beforeEach(async () => {
			renderApp(['/register']);
		});

		afterEach(() => {
			storageService.clear();
		});

		it('should displays message for login', async () => {
			await waitForElementToBeRemoved(spinner());

			expect(
				screen.getByText('You are already a user?')
			).toBeInTheDocument();
		});

		it('should redirects to login page when clicks login link', async () => {
			await waitForElementToBeRemoved(spinner());

			await user.click(linkLogin());

			await waitFor(() => {
				expect(loginPage()).toBeInTheDocument();
			});
		});

		it('should makes a request when form is submitted', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.keyboard('{Enter>1}');

			await waitForElementToBeRemoved(spinner());

			const request = requestTracker[requestTracker.length - 1];
			expect(request.method).toBe('POST');
			expect(request.path).toBe('/api/v1/auth/register');
		});

		it('should disable submit button when making a request', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.keyboard('{Enter>3}');

			await waitForElementToBeRemoved(spinner());

			const requests = requestTracker.filter((r) => r.method === 'POST');

			expect(requests[0].path).toBe('/api/v1/auth/register');
			expect(requests).toHaveLength(1);
		});

		it('should display spinner after clicking submit button', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();

			expect(spinner()).toBeNull();

			await user.keyboard('{Enter>1}');

			expect(spinner()).toBeInTheDocument();
		});

		it('should store token in local storage after register a user', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.keyboard('{Enter>1}');

			await waitForElementToBeRemoved(spinner());

			await waitFor(() => {
				const token = storageService.getItem(TOKEN_KEY, '');
				const decoded = jwt_decode(token);

				expect(token).toBeTruthy();
				expect(decoded.name).toBeTruthy();
				expect(decoded.email).toBeTruthy();
				expect(decoded.id).toBeTruthy();
			});
		});

		it('should redirects to home page after register', async () => {
			await waitForElementToBeRemoved(spinner());

			await fillForm();
			await user.keyboard('{Enter>1}');

			await waitForElementToBeRemoved(spinner());

			await waitFor(() => {
				expect(homePage()).toBeInTheDocument();
			});
		});

		describe('validation', () => {
			it('should displays error if user already exists', async () => {
				await waitForElementToBeRemoved(spinner());

				await fillForm({
					email: 'existinguser@mail.com',
				});
				await user.keyboard('{Enter>1}');

				await waitForElementToBeRemoved(spinner());

				expect(
					screen.getByText('user already exists')
				).toBeInTheDocument();
			});
		});
	});
});
