import Joi from 'joi';

const name = Joi.string()
	.label('Name')
	.required()
	.trim()
	.pattern(/^[A-Za-z0-9\s]+$/i)
	.message('"Name" should not have special characters');
const email = Joi.string()
	.label('Email')
	.required()
	.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } });
const password = Joi.string().label('Password').required().min(8).alphanum();

export const registerSchema = Joi.object({
	name,
	email,
	password,
});

export const loginSchema = Joi.object({
	email,
	password,
});

export const eventSchema = Joi.object({
	start: Joi.date().required().label('Start date'),
	end: Joi.date()
		.required()
		.label('End date')
		.greater(Joi.ref('start'))
		.message('"End Date" must be greater than "Start date"'),
	title: Joi.string()
		.label('Title')
		.required()
		.min(4)
		.trim()
		.pattern(/^[a-zA-Z0-9\s]+$/)
		.message('"Title" should not contain special characters'),
	notes: Joi.string()
		.label('Notes')
		.optional()
		.allow('')
		.trim()
		.pattern(/^[a-zA-Z0-9\s]+$/)
		.message('"Notes" should not contain special characters'),
});
