import Joi from 'joi';

const emailModel = Joi.string()
	.email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	})
	.required()
	.label('Email');

const passwordModel = Joi.string()
	.min(6)
	.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
	.required()
	.label('Password');

const userModel = Joi.string()
	.alphanum()
	.min(3)
	.max(30)
	.required()
	.label('Name');

const confirmPasswordModel = Joi.string()
	.required()
	.messages({
		'any.only': `"Passwords" do not match`,
	})
	.valid(Joi.ref('password'));

/* -------------------------------------------------------------------------- */
/*                                   schemas                                  */
/* -------------------------------------------------------------------------- */
export const registerSchema = Joi.object({
	name: userModel,
	email: emailModel,
	password: passwordModel,
	confirmPassword: confirmPasswordModel,
});

export const loginSchema = Joi.object({
	email: emailModel,
	password: passwordModel,
});

export const noteSchema = Joi.object({
	title: Joi.string().max(50).required().label('Title'),
	description: Joi.string().min(1).required().label('Description'),
});
