import React from 'react';
import PropTypes from 'prop-types';
import HandleState from './HandleState.component';
import Spinner from './Spinner.component';

function Modal({ id, labelledby, title, children, isLoading, onClose }) {
	function loadingState() {
		return (
			<div className='h-100 w-100 d-flex align-items-center justify-content-center'>
				<Spinner customClassname='text-light' />
			</div>
		);
	}

	return (
		<div
			className='modal bg-black bg-opacity-50 d-block show'
			id={id}
			tabIndex='-1'
			role='dialog'
			aria-labelledby={labelledby}
			data-testid='modal'
		>
			<HandleState isLoading={isLoading} config={{ loadingState }}>
				<div
					className='modal-dialog modal-dialog-centered'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-header'>
							{title && (
								<h3 className='modal-title' id={labelledby}>
									{title}
								</h3>
							)}
							<button
								onClick={onClose}
								type='button'
								className='btn close'
								data-dismiss='modal'
								aria-label='Close'
								data-testid='modal-close-btn'
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>{children}</div>
					</div>
				</div>
			</HandleState>
		</div>
	);
}

Modal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	labelledby: PropTypes.string,
	// isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string,
	isLoading: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
};

Modal.defaultProps = {
	closeLabel: 'Close',
};

export default Modal;
