import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders, screen, setupUser } from '../tests-utils';
import Register from '../../pages/Register.page';

function renderPage() {
	renderWithProviders(
		<BrowserRouter>
			<Register />
		</BrowserRouter>
	);
}

const user = setupUser();

describe('<Register />', () => {
	const inputName = () => screen.getByLabelText(/name/i),
		inputEmail = () => screen.getByLabelText(/email address/i),
		inputPassword = () => screen.getByLabelText('Password'),
		inputConfirmPassword = () => screen.getByLabelText('Confirm Password'),
		submitBtn = () => screen.getByRole('button', { name: /register/i });

	beforeEach(renderPage);

	async function fillForm(overrides = {}) {
		const { name, email, password, confirmPassword } = {
			name: 'aaaa',
			email: 'hola@mail.com',
			password: '123456',
			confirmPassword: '123456',
			...overrides,
		};
		await user.type(inputName(), name);
		await user.type(inputEmail(), email);
		await user.type(inputPassword(), password);
		await user.type(inputConfirmPassword(), confirmPassword);
	}

	describe('layout', () => {
		it('should displays input for name', () => {
			expect(inputName()).toBeInTheDocument();
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

		it('should displays input for confirm password', () => {
			expect(inputConfirmPassword()).toBeInTheDocument();
		});

		it('should input confirm password be of type password', () => {
			expect(inputConfirmPassword()).toHaveAttribute('type', 'password');
		});
	});

	describe('interactions', () => {
		it('should be able to change value of input name', async () => {
			const value = 'name';

			expect(inputName().value).toBe('');

			await user.type(inputName(), value);

			expect(inputName().value).toBe(value);
		});

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

		it('should be able to change value of input confirm password', async () => {
			const value = 'confirm password';

			expect(inputConfirmPassword().value).toBe('');

			await user.type(inputConfirmPassword(), value);

			expect(inputConfirmPassword().value).toBe(value);
		});

		it('should disable submit button if form is empty', () => {
			expect(submitBtn()).toBeDisabled();
		});

		it('should enable submit button if form is filled', async () => {
			await fillForm();

			expect(submitBtn()).not.toBeDisabled();
		});

		describe('validations', () => {
			it('should displays an error if name is empty', async () => {
				await fillForm({
					name: '  ',
				});
				await user.keyboard('{Enter>1}');

				expect(screen.getByText('"Name" is not allowed to be empty'));
			});

			it('should displays an error if name contains special characters', async () => {
				await fillForm({
					name: 'name/:user',
				});
				await user.keyboard('{Enter>1}');

				expect(
					screen.getByText(
						'"Name" should not have special characters'
					)
				);
			});

			it('should displays an error if email is not valid email', async () => {
				await fillForm({
					email: 'newEmail@mail',
				});
				await user.keyboard('{Enter>1}');

				expect(screen.getByText('"Email" must be a valid email'));
			});

			it('should displays an error if password is empty', async () => {
				await fillForm({
					password: '  ',
				});
				await user.keyboard('{Enter>1}');

				expect(
					screen.getByText('"Password" is not allowed to be empty')
				);
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

			it('should displays an error if confirm password is different than password', async () => {
				await fillForm({
					password: '12345678',
					confirmPassword: 'helloworldd',
				});
				await user.keyboard('{Enter>1}');

				expect(screen.getByText('"Confirm Password" does not match'));
			});
		});
	});
});
