import 'vitest';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../test-utils';
import Entries from '../../components/Entries.component';

const entries = [
	{
		id: 1,
		title: 'entry 1',
		body: 'body',
		createdAt: new Date().toISOString(),
	},
	{
		id: 2,
		title: 'entry 2',
		body: 'body',
		createdAt: new Date().toISOString(),
	},
];

describe('<Entries />', () => {
	it('should renders entries provided correctly', () => {
		const wrapper = renderEntries(entries);

		expect(wrapper.getByRole('list').childElementCount).toBe(
			entries.length
		);
		expect(wrapper.getByText(entries[0].title)).toBeInTheDocument();
		expect(wrapper.getByText(entries[1].title)).toBeInTheDocument();
	});

	it('should be empty if no entries provided', () => {
		const wrapper = renderEntries();

		expect(wrapper.getByRole('list').childElementCount).toBe(0);
	});
});

function renderEntries(entries = []) {
	return renderWithProviders(<Entries list={entries} />);
}
