import '../testServer/setupTestServer';
import MockDate from 'mockdate';
import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders, screen, setupUser, act } from '../tests-utils';
import storageService from '../../services/storage.service';
import { setupStore } from '../../store/storeConfig';
import { LAST_VIEW_KEY } from '../../config';
import { requestTracker } from '../testServer/testServerHandlers';
import { authState, userCredentials } from '../fixtures';
import HomePage from '../../pages/Home.page';

const event = {
	id: 1,
	start: '2000-01-20T06:00:00.000Z',
	end: '2000-01-22T06:00:00.000Z',
	title: 'some event',
	notes: '',
	user: {
		id: 1,
		name: 'aaa',
	},
};
const initialState = {
	entities: {
		events: {
			list: {
				1: event,
			},
		},
	},
};

function renderPage(preloadedState = {}, store) {
	const state = {
		...authState,
		...preloadedState,
	};

	renderWithProviders(
		<BrowserRouter>
			<HomePage />
		</BrowserRouter>,
		{
			preloadedState: state,
			store,
		}
	);
}

const user = setupUser();

describe('<HomePage />', () => {
	const monthViewBtn = () => screen.getByRole('button', { name: /month/i }),
		weekViewBtn = () => screen.getByRole('button', { name: /week/i }),
		addNewEvtBtn = () => screen.getByTestId('add-new-evt'),
		modal = () => screen.queryByTestId('modal'),
		inputStartDate = () => document.getElementById('inputStart'),
		inputEndDate = () => document.getElementById('inputEnd'),
		inputTitle = () => screen.getByLabelText(/title/i),
		inputNotes = () => screen.getByLabelText(/notes/i),
		submitBtn = () => screen.getByRole('button', { name: /submit/i }),
		deleteEvtBtn = () => screen.queryByTestId('delete-evt'),
		modalCloseBtn = () => screen.getByTestId('modal-close-btn');

	afterEach(storageService.clear);

	beforeAll(() => {
		MockDate.set(new Date('1/20/2000'));
	});

	afterAll(() => {
		MockDate.reset();
	});

	it('should save in localstorage last view when it changes', async () => {
		renderPage();

		await user.click(weekViewBtn());
		expect(storageService.getItem(LAST_VIEW_KEY, '')).toBe('week');

		await user.click(monthViewBtn());
		expect(storageService.getItem(LAST_VIEW_KEY, '')).toBe('month');
	});

	it('should restore last view if exists when page loads', () => {
		storageService.setItem(LAST_VIEW_KEY, 'week');

		renderPage();

		expect(weekViewBtn()).toHaveClass('rbc-active');
	});

	it('should loads by default in month view if last view not exists', () => {
		renderPage();

		expect(monthViewBtn()).toHaveClass('rbc-active');
	});

	it('should be able to navigate between views', async () => {
		renderPage();

		await user.click(weekViewBtn());
		expect(weekViewBtn()).toHaveClass('rbc-active');

		await user.click(monthViewBtn());
		expect(monthViewBtn()).toHaveClass('rbc-active');
	});

	it('should displays user name in navbar', () => {
		renderPage();

		expect(screen.getByText(userCredentials.name)).toBeInTheDocument();
	});

	it('should make a request when page loads ', async () => {
		await act(async () => {
			renderPage();
		});

		await new Promise(process.nextTick);

		expect(requestTracker).toHaveLength(1);
	});

	it('should displays all events when page loads on the calendar', async () => {
		await act(async () => {
			renderPage();
		});

		await new Promise(process.nextTick);

		expect(screen.queryByText(/event a/i)).toBeInTheDocument();
		expect(screen.queryByText(/event b/i)).toBeInTheDocument();
	});

	describe('/*== adding new events ==*/', () => {
		async function fillForm(overrides = {}) {
			const { title, notes } = {
				title: 'new event added',
				notes: ' ',
				...overrides,
			};

			await user.click(inputStartDate());
			await user.click(
				screen.getByRole('option', {
					name: /Choose Thursday, January 20th, 2000/i,
				})
			);
			await user.click(inputEndDate());
			await user.click(
				screen.getByRole('option', {
					name: /Choose Saturday, January 22nd, 2000/i,
				})
			);
			await user.type(inputTitle(), title);
			await user.type(inputNotes(), notes);
		}

		it('should displays button for add new event', () => {
			renderPage();

			expect(addNewEvtBtn()).toBeInTheDocument();
		});

		it('should open modal after clicking add new event button', async () => {
			renderPage();

			expect(modal()).toBeNull();

			await user.click(addNewEvtBtn());

			expect(modal()).toBeInTheDocument();
		});

		it('should makes request when submit form', async () => {
			renderPage();

			await user.click(addNewEvtBtn());
			await fillForm();
			await user.click(submitBtn());

			const request = requestTracker[requestTracker.length - 1];
			expect(request.method).toBe('POST');
			expect(request.path).toBe('/api/v1/events');
		});

		it('should close modal when new event added', async () => {
			renderPage();

			await user.click(addNewEvtBtn());
			await fillForm();
			await user.click(submitBtn());

			expect(modal()).toBeNull();
		});

		it('should displays new event on the calendar', async () => {
			renderPage();

			await user.click(addNewEvtBtn());
			await fillForm({
				title: 'this event should be rendered',
			});
			await user.click(submitBtn());

			expect(
				screen.queryByText('this event should be rendered')
			).toBeInTheDocument();
		});

		it('should not displays filled form after adding new event', async () => {
			renderPage();

			await user.click(addNewEvtBtn());
			await fillForm();
			await user.click(submitBtn());

			await user.click(addNewEvtBtn());

			expect(inputStartDate().value).toBe('');
			expect(inputEndDate().value).toBe('');
			expect(inputTitle().value).toBe('');
			expect(inputNotes().value).toBe('');
		});

		it('should not displays filled form if close modal', async () => {
			renderPage();

			await user.click(addNewEvtBtn());
			await fillForm();
			await user.click(modalCloseBtn());
			await user.click(addNewEvtBtn());

			expect(inputStartDate().value).toBe('');
			expect(inputEndDate().value).toBe('');
			expect(inputTitle().value).toBe('');
			expect(inputNotes().value).toBe('');
		});
	});

	describe('/*== selectioning events == */', () => {
		it('should select an event when clicks on it', async () => {
			const store = setupStore(authState);
			await act(async () => {
				renderPage({}, store);
			});

			expect(store.getState().entities.events.active).toBeNull();

			await new Promise(process.nextTick);

			const { list } = store.getState().entities.events;
			const eventToSelect = list['1'];
			await user.click(screen.queryByText(eventToSelect.title));

			const { active } = store.getState().entities.events;
			expect(active).toBeTruthy();
			expect(active).toEqual(eventToSelect);
		});
	});

	describe('/*== editing events ==*/', () => {
		let store, eventToUpdate, anotherEventToUpdate;

		beforeEach(async () => {
			store = setupStore(authState);
			await act(async () => {
				renderPage({}, store);
			});

			const { list } = store.getState().entities.events;
			eventToUpdate = list['1'];
			anotherEventToUpdate = list['2'];
		});

		it('should open modal after double click on any event', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));

			expect(modal()).toBeInTheDocument();
		});

		it('should change modal title', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));

			expect(
				screen.getByRole('heading', { name: /edit event/i })
			).toBeInTheDocument();
		});

		it('should load event info when modal opens', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));

			const startDate = new Date(
					eventToUpdate.start
				).toLocaleDateString(),
				endDate = new Date(eventToUpdate.end).toLocaleDateString();

			expect(inputStartDate().value.includes(startDate)).toBe(true);
			expect(inputEndDate().value.includes(endDate)).toBe(true);
			expect(inputTitle().value).toBe(eventToUpdate.title);
			expect(inputNotes().value).toBe(eventToUpdate.notes);
		});

		it('should makes a request when submit form', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));
			await user.clear(inputTitle());
			await user.type(inputTitle(), 'event updated');
			await user.click(submitBtn());

			await new Promise(process.nextTick);

			const request = requestTracker[requestTracker.length - 1];
			expect(request.method).toBe('PUT');
			expect(request.path).toBe(`/api/v1/events/${eventToUpdate.id}`);
		});

		it('should close modal when submit form', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));
			await user.click(submitBtn());

			expect(modal()).toBeNull();
		});

		it('should displays event updated after successful edition', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));
			await user.clear(inputTitle());
			await user.type(inputTitle(), 'event updated');
			await user.click(submitBtn());

			expect(screen.getByText(/event updated/i)).toBeInTheDocument();
		});

		it('should displays events info correctly when clicking multiple events', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));
			const startDate = new Date(
					eventToUpdate.start
				).toLocaleDateString(),
				endDate = new Date(eventToUpdate.end).toLocaleDateString();

			expect(inputStartDate().value.includes(startDate)).toBe(true);
			expect(inputEndDate().value.includes(endDate)).toBe(true);
			expect(inputTitle().value).toBe(eventToUpdate.title);
			expect(inputNotes().value).toBe(eventToUpdate.notes);

			await user.click(modalCloseBtn());

			await user.dblClick(screen.getByText(anotherEventToUpdate.title));
			const startDateB = new Date(
					anotherEventToUpdate.start
				).toLocaleDateString(),
				endDateB = new Date(
					anotherEventToUpdate.end
				).toLocaleDateString();

			expect(inputStartDate().value.includes(startDateB)).toBe(true);
			expect(inputEndDate().value.includes(endDateB)).toBe(true);
			expect(inputTitle().value).toBe(anotherEventToUpdate.title);
			expect(inputNotes().value).toBe(anotherEventToUpdate.notes);
		});

		it('should displays empty form if event was edited successfuly and open modal for new event', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));
			await user.clear(inputTitle());
			await user.type(inputTitle(), 'event updated');
			await user.click(submitBtn());

			await user.click(addNewEvtBtn());
			expect(
				screen.queryByRole('heading', { name: /edit event/i })
			).toBeNull();
			expect(inputStartDate().value).toBe('');
			expect(inputEndDate().value).toBe('');
			expect(inputTitle().value).toBe('');
			expect(inputNotes().value).toBe('');
		});

		it('should displays empty form if close modal and it reopens for new event', async () => {
			await user.dblClick(screen.getByText(eventToUpdate.title));
			await user.clear(inputTitle());
			await user.type(inputTitle(), 'event updated');

			await user.click(modalCloseBtn());

			await user.click(addNewEvtBtn());
			expect(
				screen.queryByRole('heading', { name: /edit event/i })
			).toBeNull();
			expect(inputStartDate().value).toBe('');
			expect(inputEndDate().value).toBe('');
			expect(inputTitle().value).toBe('');
			expect(inputNotes().value).toBe('');
		});
	});

	describe('/*== deleting events ==*/', () => {
		let store, eventToDelete;

		beforeEach(async () => {
			store = setupStore(authState);
			await act(async () => {
				renderPage({}, store);
			});

			const { list } = store.getState().entities.events;
			eventToDelete = list['1'];
		});

		it('should not displays delete button if no event is selected', () => {
			expect(deleteEvtBtn()).toBeNull();
		});

		it('should displays delete button when select an event', async () => {
			await user.click(screen.getByText(eventToDelete.title));

			expect(deleteEvtBtn()).toBeInTheDocument();
		});

		it('should makes a request when deleting an event', async () => {
			await user.click(screen.getByText(eventToDelete.title));
			await user.click(deleteEvtBtn());

			await new Promise(process.nextTick);

			const request = requestTracker[requestTracker.length - 1];
			expect(request.method).toBe('DELETE');
			expect(request.path).toBe(`/api/v1/events/${eventToDelete.id}`);
		});

		it('should delete an event when clicks delete button', async () => {
			expect(screen.getByText(eventToDelete.title)).toBeInTheDocument();

			await user.click(screen.getByText(eventToDelete.title));
			await user.click(deleteEvtBtn());

			await new Promise(process.nextTick);

			expect(screen.queryByText(event.title)).toBeNull();
		});

		it('should not displays delete button after deleting an event', async () => {
			expect(screen.getByText(eventToDelete.title)).toBeInTheDocument();

			await user.click(screen.getByText(eventToDelete.title));
			await user.click(deleteEvtBtn());

			expect(deleteEvtBtn()).toBeNull();
		});

		it('should not displays filled form if delete an event and clicking button to add new event', async () => {
			expect(screen.getByText(eventToDelete.title)).toBeInTheDocument();

			await user.click(screen.getByText(eventToDelete.title));
			await user.click(deleteEvtBtn());
			await user.click(addNewEvtBtn());

			expect(
				screen.queryByRole('heading', { name: /edit event/i })
			).toBeNull();
			expect(inputStartDate().value).toBe('');
			expect(inputEndDate().value).toBe('');
			expect(inputTitle().value).toBe('');
			expect(inputNotes().value).toBe('');
		});
	});
});
