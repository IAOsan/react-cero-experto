import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, screen, setupUser } from './tests-utils';
import App from '../App';

function renderApp(entries = ['/']) {
	renderWithProviders(
		<MemoryRouter initialEntries={entries}>
			<App />
		</MemoryRouter>
	);
}

const user = setupUser();

describe('<App />', () => {
	const homePage = () => screen.queryByTestId('home-page'),
		loginPage = () => screen.queryByTestId('login-page'),
		registerPage = () => screen.queryByTestId('register-page'),
		linkSignUp = () => screen.getByRole('link', { name: /sign up/i }),
		linkLogin = () => screen.getByRole('link', { name: /login/i });

	it('should displays only home page in the route "/"', () => {
		renderApp();

		expect(homePage()).toBeInTheDocument();
		expect(loginPage()).toBeNull();
		expect(registerPage()).toBeNull();
	});

	it('should displays only login page in the route "/login"', () => {
		renderApp(['/login']);

		expect(loginPage()).toBeInTheDocument();
		expect(homePage()).toBeNull();
		expect(registerPage()).toBeNull();
	});

	it('should displays only register page in the route "/sign_up"', () => {
		renderApp(['/sign_up']);

		expect(registerPage()).toBeInTheDocument();
		expect(loginPage()).toBeNull();
		expect(homePage()).toBeNull();
	});

	it('should redirects to home page if the path doesnt exists', () => {
		renderApp(['/somewhere']);

		expect(homePage()).toBeInTheDocument();
	});

	describe('/*== login ==*/', () => {
		beforeEach(() => {
			renderApp(['/login']);
		});

		it('should displays message for non account', async () => {
			expect(
				screen.getByText('Dont have an account?')
			).toBeInTheDocument();
		});

		it('should redirects to signup page when clicks signup link', async () => {
			await user.click(linkSignUp());

			expect(registerPage()).toBeInTheDocument();
		});
	});

	describe('/*== register ==*/', () => {
		beforeEach(() => {
			renderApp(['/sign_up']);
		});

		it('should displays message for login', async () => {
			expect(
				screen.getByText('You are already a user?')
			).toBeInTheDocument();
		});

		it('should redirects to login page when clicks login link', async () => {
			await user.click(linkLogin());

			expect(loginPage()).toBeInTheDocument();
		});
	});
});
