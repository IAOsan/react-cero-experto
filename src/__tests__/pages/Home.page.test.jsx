import MockDate from 'mockdate';
import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders, screen, setupUser } from '../tests-utils';
import HomePage from '../../pages/Home.page';
import * as storageService from '../../services/storage.service';
import { setupStore } from '../../store/storeConfig';
import { LAST_VIEW_KEY } from '../../config';

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

function renderPage(preloadedState, store) {
	renderWithProviders(
		<BrowserRouter>
			<HomePage />
		</BrowserRouter>,
		{
			preloadedState,
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

	describe('/*== adding new events ==*/', () => {
		async function fillForm() {
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
			await user.type(inputTitle(), 'new event added');
			await user.type(inputNotes(), ' ');
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

		it('should close modal when new event added successfuly', async () => {
			renderPage();

			await user.click(addNewEvtBtn());
			await fillForm();
			await user.click(submitBtn());

			expect(modal()).toBeNull();
		});

		it('should displays new event on the calendar', async () => {
			renderPage();

			await user.click(addNewEvtBtn());
			await fillForm();
			await user.click(submitBtn());

			expect(screen.getByText(/new event added/i)).toBeInTheDocument();
		});

		it('should not displays filled form after adding new event successfuly', async () => {
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

		it('should not displays filled if close modal', async () => {
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
	});

	describe('/*== selectioning events == */', () => {
		let store;

		beforeEach(() => {
			store = setupStore(initialState);
			renderPage(undefined, store);
		});

		it('should select an event when clicks on it', async () => {
			await user.click(screen.getByText(event.title));

			const activeEvt = store.getState().entities.events.active;
			expect(activeEvt).toEqual(event);
		});
	});

	describe('/*== editing events ==*/', () => {
		it('should open modal after double click on any event', async () => {
			renderPage(initialState);

			await user.dblClick(screen.getByText(event.title));

			expect(modal()).toBeInTheDocument();
		});

		it('should change modal title', async () => {
			renderPage(initialState);

			await user.dblClick(screen.getByText(event.title));

			expect(
				screen.getByRole('heading', { name: /edit event/i })
			).toBeInTheDocument();
		});

		it('should load event info when modal opens', async () => {
			renderPage(initialState);

			await user.dblClick(screen.getByText(event.title));

			const startDate = new Date(event.start).toLocaleDateString(),
				endDate = new Date(event.end).toLocaleDateString();

			expect(inputStartDate().value.includes(startDate)).toBe(true);
			expect(inputEndDate().value.includes(endDate)).toBe(true);
			expect(inputTitle().value).toBe(event.title);
			expect(inputNotes().value).toBe(event.notes);
		});

		it('should close modal when event edited successfuly', async () => {
			renderPage(initialState);

			await user.dblClick(screen.getByText(event.title));
			await user.click(submitBtn());

			expect(modal()).toBeNull();
		});

		it('should displays event updated after successful edition', async () => {
			renderPage(initialState);

			await user.dblClick(screen.getByText(event.title));
			await user.clear(inputTitle());
			await user.type(inputTitle(), 'event updated');
			await user.click(submitBtn());

			expect(screen.getByText(/event updated/i)).toBeInTheDocument();
		});

		it('should displays events info correctly when clicking multiple events', async () => {
			const state = JSON.parse(JSON.stringify(initialState));
			const eventB = {
				...event,
				id: 2,
				start: '2000-01-25T06:00:00.000Z',
				end: '2000-01-26T06:00:00.000Z',
				title: 'some event b',
			};
			state.entities.events.list[2] = eventB;

			renderPage(state);

			await user.dblClick(screen.getByText(event.title));
			const startDate = new Date(event.start).toLocaleDateString(),
				endDate = new Date(event.end).toLocaleDateString();

			expect(inputStartDate().value.includes(startDate)).toBe(true);
			expect(inputEndDate().value.includes(endDate)).toBe(true);
			expect(inputTitle().value).toBe(event.title);
			expect(inputNotes().value).toBe(event.notes);

			await user.click(modalCloseBtn());

			await user.dblClick(screen.getByText(eventB.title));
			const startDateB = new Date(eventB.start).toLocaleDateString(),
				endDateB = new Date(eventB.end).toLocaleDateString();

			expect(inputStartDate().value.includes(startDateB)).toBe(true);
			expect(inputEndDate().value.includes(endDateB)).toBe(true);
			expect(inputTitle().value).toBe(eventB.title);
			expect(inputNotes().value).toBe(eventB.notes);
		});

		it('should displays empty form  if event was edited successfuly and open modal for new event', async () => {
			renderPage(initialState);

			await user.dblClick(screen.getByText(event.title));
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
			renderPage(initialState);

			await user.dblClick(screen.getByText(event.title));
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
		it('should not displays delete button if no event is selected', () => {
			renderPage();

			expect(deleteEvtBtn()).toBeNull();
		});

		it('should displays delete button when select an event', async () => {
			renderPage(initialState);

			await user.click(screen.getByText(event.title));

			expect(deleteEvtBtn()).toBeInTheDocument();
		});

		it('should delete an event when clicks delete button', async () => {
			renderPage(initialState);

			expect(screen.getByText(event.title)).toBeInTheDocument();

			await user.click(screen.getByText(event.title));
			await user.click(deleteEvtBtn());

			expect(screen.queryByText(event.title)).toBeNull();
		});

		it('should not displays delete button after deleting an event', async () => {
			renderPage(initialState);

			expect(screen.getByText(event.title)).toBeInTheDocument();

			await user.click(screen.getByText(event.title));
			await user.click(deleteEvtBtn());

			expect(deleteEvtBtn()).toBeNull();
		});

		it('should not displays filled form if delete an event and clicking button to add new event', async () => {
			renderPage(initialState);

			expect(screen.getByText(event.title)).toBeInTheDocument();

			await user.click(screen.getByText(event.title));
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
