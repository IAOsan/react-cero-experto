import { renderWithProviders } from '../test-utils';
import Home from '../../pages/Home.page';

describe('<Home />', () => {
	it('should renders correctly', () => {
		const wrapper = renderHome();

		expect(wrapper.container.firstElementChild).toMatchSnapshot();
	});
	it('Should show the empty state if not note is selected', () => {
		const wrapper = renderHome();

		expect(wrapper.getByText(/¡nothing selected!/i)).toBeInTheDocument();
	});
	it('Should show the selected note', () => {
		const wrapper = renderHome();

		expect(wrapper.queryByText(/¡nothing selected!/i)).toBeNull();
		expect();
	});
});

function renderHome() {
	return renderWithProviders(<Home />);
}
