import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

async function login(req, res) {
	const { password, email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				status: 'failed',
				error: {
					email: {
						message: '"User" not exists',
					},
				},
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({
				status: 'success',
				error: {
					password: {
						message: '"Password" does not match',
					},
				},
			});
		}

		const token = await generateToken({
			id: user._id,
			name: user.name,
			email: user.email,
		});

		return res.status(200).json({
			status: 'success',
			data: {
				user: {
					...JSON.parse(JSON.stringify(user)),
					token,
				},
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			error,
		});
	}
}

async function register(req, res) {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });

		if (!!user) {
			return res.status(400).json({
				status: 'failed',
				error: {
					email: {
						message: '"Email" already exists',
					},
				},
			});
		}

		const hash = await bcrypt.hash(password, 10);
		user = await User.create({ ...req.body, password: hash });
		const token = await generateToken({
			id: user._id,
			name: user.name,
			email: user.email,
		});

		return res.status(201).json({
			status: 'success',
			data: {
				user: {
					...JSON.parse(JSON.stringify(user)),
					token,
				},
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			error,
		});
	}
}

async function renew(req, res) {
	const { user } = req;
	try {
		const token = await generateToken(user);

		return res.status(200).json({
			status: 'success',
			data: { token },
		});
	} catch (error) {
		return res.status(500).json({
			status: 'failed',
			error,
		});
	}
}

const controllers = {
	login,
	register,
	renew,
};

export default controllers;
