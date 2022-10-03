import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from './common/Modal.component';
import Form from './common/Form.component';
import DatePicker from 'react-datepicker';
import FormInput from './common/FormInput.component';
import { closeModal, selectUiState } from '../store/ui/ui.slice';
import {
	addEvent,
	editEvent,
	selectActiveEvt,
	clearActiveEvent,
} from '../store/entities/events.slice';
import useActions from '../hooks/useActions';
import { newEventSchema } from '../validation/schemas';
import 'react-datepicker/dist/react-datepicker.css';

const formSchema = {
	start: null,
	end: null,
	title: '',
	notes: '',
};

function CalendarModal() {
	const actions = useActions({
		closeModal,
		addEvent,
		clearActiveEvent,
		editEvent,
	});
	const { isModalOpen } = useSelector(selectUiState);
	const activeEvt = useSelector(selectActiveEvt);
	const [formData, setFormData] = useState(formSchema);
	const [errors, setErrors] = useState({});
	const isEditing = !!activeEvt;

	useEffect(() => {
		if (activeEvt && isModalOpen) {
			setFormData((prevState) => {
				const preloadedData = Object.keys(prevState).reduce(
					(acc, k) => {
						acc[k] = activeEvt[k];
						return acc;
					},
					{}
				);
				return preloadedData;
			});
		}
	}, [activeEvt, isModalOpen]);

	const InputDate = React.forwardRef((props, ref) => {
		return (
			<FormInput id={props.id} {...props} autoComplete='off' ref={ref} />
		);
	});

	function handleClose() {
		setFormData(formSchema);
		actions.clearActiveEvent();
		actions.closeModal();
	}

	function handleChange({ target }) {
		setFormData((prevState) => ({
			...prevState,
			[target.name]: target.value,
		}));
	}

	function handleSubmit(e) {
		e.preventDefault();

		const errors = validate();
		setErrors(errors);

		if (Object.keys(errors).length) return;

		if (isEditing) {
			actions.editEvent({
				...formData,
				id: activeEvt.id,
			});
		} else {
			actions.addEvent({
				...formData,
				id: Date.now(),
				user: { id: 2, name: 'aaa' },
			});
		}
		handleClose();
	}

	function validate() {
		const { error } = newEventSchema.validate(formData);
		const errors = error?.details.reduce((acc, err) => {
			const { context, message } = err;
			acc[context.key] = message;
			return acc;
		}, {});

		return errors || {};
	}

	function handleChangeDate(name) {
		return function (date) {
			handleChange({
				target: {
					name: name,
					value: new Date(date).toISOString(),
				},
			});
		};
	}

	function parseDateToView(date) {
		if (date) return new Date(date);
		return date;
	}

	if (!isModalOpen) return null;

	return (
		<Modal
			id='calendar-modal'
			title={isEditing ? 'Edit event' : 'New Event'}
			isOpen={isModalOpen}
			onClose={handleClose}
		>
			<Form
				fields={[
					{
						component: (
							<DatePicker
								key='inputStartDate'
								selected={parseDateToView(formData.start)}
								id='inputStart'
								name='start'
								placeholderText='MM/DD/YY'
								timeInputLabel='Time:'
								dateFormat='MM/dd/yyyy h:mm aa'
								minDate={new Date()}
								showTimeInput
								fixedHeight
								onChange={handleChangeDate('start')}
								customInput={
									<InputDate
										label='Start date and time'
										error={errors.start}
									/>
								}
							/>
						),
					},
					{
						component: (
							<DatePicker
								key='inputEndDate'
								selected={parseDateToView(formData.end)}
								id='inputEnd'
								name='end'
								placeholderText='MM/DD/YY'
								timeInputLabel='Time:'
								dateFormat='MM/dd/yyyy h:mm aa'
								minDate={new Date()}
								showTimeInput
								fixedHeight
								onChange={handleChangeDate('end')}
								customInput={
									<InputDate
										label='End date and time'
										error={errors.end}
									/>
								}
							/>
						),
					},
					{
						id: 'inputTitle',
						label: 'Title',
						name: 'title',
						type: 'text',
						placeholder: 'Title',
						autoComplete: 'off',
						description: 'A short description',
						value: formData.title,
						onChange: handleChange,
						error: errors.title,
					},
					{
						id: 'inputNotes',
						label: 'Notes',
						name: 'notes',
						type: 'textarea',
						autoComplete: 'off',
						description: 'Additional information',
						placeholder: 'Notes',
						value: formData.notes,
						onChange: handleChange,
						error: errors.notes,
					},
				]}
				onSubmit={handleSubmit}
				customFormClass='form-calendar p-3'
			/>
		</Modal>
	);
}

export default CalendarModal;
