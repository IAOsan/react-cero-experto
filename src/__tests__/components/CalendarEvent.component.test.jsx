import { render, screen } from '../tests-utils';
import CalendarEvent from '../../components/CalendarEvent.component';
import moment from 'moment';

function renderEvent(props = {}) {
	render(<CalendarEvent {...props} />);
}

const event = {
	event: {
		title: 'some event',
		start: moment().toDate(),
		end: moment().add(2, 'hours').toDate(),
		bgcolor: '#c4c4c4',
		user: { id: 1, name: 'batman' },
	},
};

describe('<CalendarEvent />', () => {
	it('should displays title and name  who created the event', () => {
		renderEvent(event);

		expect(screen.getByText(event.event.title)).toBeInTheDocument();
		expect(
			screen.getByText(`- ${event.event.user.name}`)
		).toBeInTheDocument();
	});
});
