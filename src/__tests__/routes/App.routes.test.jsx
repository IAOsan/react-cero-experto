import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import AppRoutes from '../../routes/App.routes';

const user = {
	name: 'test user',
	email: 'hola@mail.com',
	password: '123456',
};

describe('<AppRoutes />', () => {
	it('should render home if its authenticated', () => {
		const state = {
			auth: {
				user,
				isAuth: true,
			},
		};
		const wrapper = renderRoutes(state);

		expect(wrapper.getByText(user.name)).toBeInTheDocument();
	});
	it('should redirect to login if is not authenticated', () => {
		const wrapper = renderRoutes();

		expect(wrapper.getByText(/log in/i)).toBeInTheDocument();
	});
});

function renderRoutes(state = {}) {
	return renderWithProviders(
		<MemoryRouter>
			<AppRoutes />
		</MemoryRouter>,
		{
			preloadedState: state,
		}
	);
}
