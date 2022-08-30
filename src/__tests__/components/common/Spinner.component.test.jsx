import 'vitest';
import '@testing-library/jest-dom';
import { render } from '../../test-utils';
import Spinner from '../../../components/common/Spinner/Spinner.component';

describe('<Spinner />', () => {
	it('should renders by default properly', () => {
		const wrapper = renderSpinner();
		expect(wrapper.container.firstChild).toMatchSnapshot();
	});

	it('should renders in size extra small', () => {
		renderSpinner({ size: 'xs' });

		const spinner = document.querySelector('.lds-ring');
		expect(spinner).toHaveClass('lds-ring--xs');
	});

	it('should renders in size extra small', () => {
		renderSpinner({ size: 'sm' });

		const spinner = document.querySelector('.lds-ring');
		expect(spinner).toHaveClass('lds-ring--sm');
	});

	it('should renders in color light', () => {
		renderSpinner({ color: 'light' });

		const spinner = document.querySelector('.lds-ring');
		expect(spinner).toHaveStyle('--c: #f5f5f5');
	});

	it('should not wrap into flex if its inline', () => {
		renderSpinner({ inline: true });

		expect(
			document.querySelector('.lds-ring').parentElement.className
		).toBeFalsy();
	});
});

function renderSpinner(props) {
	return render(<Spinner {...props} />);
}
