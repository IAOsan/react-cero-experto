import React from 'react';
import PropTypes from 'prop-types';

function CalendarEvent({ event }) {
	const { title, user } = event;

	return (
		<div className='event' data-testid='event'>
			<span>{title}</span>
			<strong> - {user.name}</strong>
		</div>
	);
}

CalendarEvent.propTypes = {
	event: PropTypes.shape({
		title: PropTypes.string,
		user: PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			name: PropTypes.string,
		}),
	}),
};

export default CalendarEvent;
