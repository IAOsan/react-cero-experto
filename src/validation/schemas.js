import Joi from 'joi';

export const newEventSchema = Joi.object({
	start: Joi.date().required().label('Start date'),
	end: Joi.date()
		.required()
		.label('End date')
		.greater(Joi.ref('start'))
		.message('"End Date" must be greater than "Start date"'),
	title: Joi.string()
		.required()
		.label('Title')
		.min(4)
		.pattern(/^[a-zA-Z0-9\s]+$/)
		.message('"Title" should not contain special characters'),
	notes: Joi.string()
		.optional()
		.allow('')
		.label('Notes')
		.pattern(/^[a-zA-Z0-9\s]+$/)
		.message('"Notes" should not contain special characters'),
});
