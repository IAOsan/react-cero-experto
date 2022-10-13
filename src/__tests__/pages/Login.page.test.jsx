import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders, screen, setupUser } from '../tests-utils';
import Login from '../../pages/Login.page';

function renderPage() {
	renderWithProviders(
		<BrowserRouter>
			<Login />
		</BrowserRouter>
	);
}

const user = setupUser();

describe('<Login />', () => {
	const inputEmail = () => screen.getByLabelText(/email address/i),
		inputPassword = () => screen.getByLabelText(/password/i),
		submitBtn = () => screen.getByRole('button', { name: /login/i });

	async function fillForm(overrides = {}) {
		const { email, password } = {
			email: 'hola@mail.com',
			password: '12345678',
			...overrides,
		};

		await user.type(inputEmail(), email);
		await user.type(inputPassword(), password);
	}

	beforeEach(renderPage);

	describe('/*== layout ==*/', () => {
		it('should displays heading', () => {
			expect(
				screen.getByRole('heading', { name: /login/i })
			).toBeInTheDocument();
		});

		it('should displays input for email', () => {
			expect(inputEmail()).toBeInTheDocument();
		});

		it('should input email be of type email', () => {
			expect(inputEmail()).toHaveAttribute('type', 'email');
		});

		it('should displays input for password', () => {
			expect(inputPassword()).toBeInTheDocument();
		});

		it('should input password be of type password', () => {
			expect(inputPassword()).toHaveAttribute('type', 'password');
		});
	});

	describe('/*== interactions ==*/', () => {
		it('should be able to change value of input email', async () => {
			const value = 'hola@mail.com';

			expect(inputEmail().value).toBe('');

			await user.type(inputEmail(), value);

			expect(inputEmail().value).toBe(value);
		});

		it('should be able to change value of input password', async () => {
			const value = 'password';

			expect(inputPassword().value).toBe('');

			await user.type(inputPassword(), value);

			expect(inputPassword().value).toBe(value);
		});

		it('should disable submit button if form is empty', () => {
			expect(submitBtn()).toBeDisabled();
		});

		it('should enable submit button if form is filled', async () => {
			await fillForm();

			expect(submitBtn()).not.toBeDisabled();
		});

		describe('validations', () => {
			it('should displays an error if email is not valid email', async () => {
				await fillForm({
					email: 'newEmail@mail',
				});
				await user.keyboard('{Enter>1}');

				expect(screen.getByText('"Email" must be a valid email'));
			});
		});

		it('should displays an error if password is empty', async () => {
			await fillForm({
				password: '  ',
			});
			await user.keyboard('{Enter>1}');

			expect(screen.getByText('"Password" is not allowed to be empty'));
		});

		it('should displays an error if password have less 8 characters', async () => {
			await fillForm({
				password: '1234',
			});
			await user.keyboard('{Enter>1}');

			expect(
				screen.getByText(
					'"Password" length must be at least 8 characters long'
				)
			);
		});

		it('should displays an error if password have non alphanumeric characters', async () => {
			await fillForm({
				password: '1234:://123',
			});
			await user.keyboard('{Enter>1}');

			expect(
				screen.getByText(
					'"Password" must only contain alpha-numeric characters'
				)
			);
		});
	});
});
