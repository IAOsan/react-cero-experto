import MockDate from 'mockdate';
import { renderWithProviders, screen, setupUser } from '../tests-utils';
import CalendarModal from '../../components/CalendarModal.component';

const initState = {
	ui: {
		isModalOpen: true,
	},
};

function renderModal() {
	renderWithProviders(<CalendarModal />, {
		preloadedState: initState,
	});
}

const user = setupUser();

describe('<CalendarModal />', () => {
	const inputStartDate = () => document.getElementById('inputStart'),
		inputEndDate = () => document.getElementById('inputEnd'),
		inputTitle = () => screen.getByLabelText(/title/i),
		inputNotes = () => screen.getByLabelText(/notes/i),
		submitBtn = () => screen.getByRole('button', { name: /submit/i });
	let actualDate;

	beforeAll(() => {
		MockDate.set('1/20/2000');
		actualDate = new Date().getDate();
	});

	afterAll(() => {
		MockDate.reset();
	});

	it('should start date input initially be empty', () => {
		renderModal();

		expect(inputStartDate().value).toBe('');
	});

	it('should end date input value initially be empty', () => {
		renderModal();

		expect(inputEndDate().value).toBe('');
	});

	it('should be able to select a start date', async () => {
		renderModal();

		await user.click(inputStartDate());
		await user.click(screen.getByText(actualDate));

		expect(inputStartDate().value).toBeTruthy();
	});

	it('should not select a start date before actual date', async () => {
		renderModal();

		await user.click(inputStartDate());
		await user.click(screen.getByText(actualDate - 1));

		expect(inputStartDate().value).toBe('');
	});

	it('should be able to select a end date', async () => {
		renderModal();

		await user.click(inputEndDate());
		await user.click(screen.getByText(actualDate + 1));

		expect(inputEndDate().value).toBeTruthy();
	});

	it('should not select a end date before actual date', async () => {
		renderModal();

		await user.click(inputEndDate());
		await user.click(screen.getByText(actualDate - 2));

		expect(inputEndDate().value).toBe('');
	});

	describe('/*== validations ==*/', () => {
		it('should displays error if start date is not selected', async () => {
			renderModal();

			await user.click(submitBtn());

			expect(
				screen.getByText('"Start date" must be a valid date')
			).toBeInTheDocument();
		});

		it('should displays error if end date is not selected', async () => {
			renderModal();

			await user.click(inputStartDate());
			await user.click(screen.getByText(actualDate));
			await user.click(submitBtn());

			expect(
				screen.getByText('"End date" must be a valid date')
			).toBeInTheDocument();
		});

		it('should displays error if dates are equal', async () => {
			renderModal();

			await user.click(inputStartDate());
			await user.click(screen.getByText(actualDate));
			await user.click(inputEndDate());
			await user.click(screen.getByText(actualDate));
			await user.click(submitBtn());

			expect(
				screen.getByText('"End Date" must be greater than "Start date"')
			).toBeInTheDocument();
		});

		it('should displays error if start date are greater than end date', async () => {
			renderModal();

			await user.click(inputStartDate());
			await user.click(screen.getByText(actualDate + 5));
			await user.click(inputEndDate());
			await user.click(screen.getByText(actualDate));
			await user.click(submitBtn());

			expect(
				screen.getByText('"End Date" must be greater than "Start date"')
			).toBeInTheDocument();
		});

		it('should displays error if title are empty', async () => {
			renderModal();

			await user.click(inputStartDate());
			await user.click(screen.getByText(actualDate));
			await user.click(inputEndDate());
			await user.click(screen.getByText(actualDate + 2));
			await user.click(submitBtn());

			expect(
				screen.getByText('"Title" is not allowed to be empty')
			).toBeInTheDocument();
		});

		it('should displays error if title dont have min 4 characters', async () => {
			renderModal();

			await user.click(inputStartDate());
			await user.click(screen.getByText(actualDate));
			await user.click(inputEndDate());
			await user.click(screen.getByText(actualDate + 2));
			await user.type(inputTitle(), 'tit');
			await user.click(submitBtn());

			expect(
				screen.getByText(
					'"Title" length must be at least 4 characters long'
				)
			).toBeInTheDocument();
		});

		it('should displays error if title contains special characters', async () => {
			renderModal();

			await user.click(inputStartDate());
			await user.click(screen.getByText(actualDate));
			await user.click(inputEndDate());
			await user.click(screen.getByText(actualDate + 2));
			await user.type(inputTitle(), 'Title /:title');
			await user.click(submitBtn());

			expect(
				screen.getByText(
					/"Title" should not contain special characters/i
				)
			).toBeInTheDocument();
		});

		it('should displays error if notes contains special characters', async () => {
			renderModal();

			await user.click(inputStartDate());
			await user.click(screen.getByText(actualDate));
			await user.click(inputEndDate());
			await user.click(screen.getByText(actualDate + 2));
			await user.type(inputTitle(), 'New title');
			await user.type(inputNotes(), 'notes /:notes');
			await user.click(submitBtn());

			expect(
				screen.getByText(
					/"Notes" should not contain special characters/i
				)
			).toBeInTheDocument();
		});
	});
});
