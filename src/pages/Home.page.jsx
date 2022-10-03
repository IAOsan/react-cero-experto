import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Header from '../components/Header.component';
import CalendarEvent from '../components/CalendarEvent.component';
import CalendarModal from '../components/CalendarModal.component';
import FabDeleteEvent from '../components/FabDeleteEvent.component';
import { openModal } from '../store/ui/ui.slice';
import {
	selectEventsList,
	selectActiveEvent,
	selectActiveEvt,
	deleteEvent,
	clearActiveEvent,
} from '../store/entities/events.slice';
import useActions from '../hooks/useActions';
import * as storageService from '../services/storage.service';
import { LAST_VIEW_KEY } from '../config';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import FabAddEvent from '../components/FabAddEvent.component';

const localizer = momentLocalizer(moment);

export function HomePage() {
	const actions = useActions({
		openModal,
		selectActiveEvent,
		deleteEvent,
		clearActiveEvent,
	});
	const eventsList = useSelector(selectEventsList);
	const activeEvt = useSelector(selectActiveEvt);
	const [view, setView] = useState(storageService.getItem(LAST_VIEW_KEY));

	function eventStyleGetter(event, start, end, isSelected) {
		return {
			style: {
				backgroundColor: isSelected ? '#E66F4C' : '#3459e6',
				borderRadius: '0px',
				display: 'block',
				color: '#f4f4f4',
			},
		};
	}

	function handleDblClick(e) {
		actions.openModal();
	}

	function handleSelectEvt(e) {
		actions.selectActiveEvent(e.id);
	}

	function handleViewChange(e) {
		setView(e);
		storageService.setItem(LAST_VIEW_KEY, e);
	}

	return (
		<>
			<Header />
			<main data-testid='home-page'>
				<Calendar
					localizer={localizer}
					events={eventsList}
					startAccessor='start'
					endAccessor='end'
					eventPropGetter={eventStyleGetter}
					components={{
						event: CalendarEvent,
					}}
					view={view}
					// selectable={true}
					onDoubleClickEvent={handleDblClick}
					onSelectEvent={handleSelectEvt}
					onView={handleViewChange}
					// onSelectSlot={() => actions.clearActiveEvent()}
				/>
				<CalendarModal />
				<FabDeleteEvent
					isVisible={!!activeEvt}
					onDelete={() => actions.deleteEvent(activeEvt.id)}
				/>
				<FabAddEvent onAdd={() => actions.openModal()} />
			</main>
		</>
	);
}

export default HomePage;
