import jwt from 'jsonwebtoken';

export function generateToken(payload) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.JWT_PRIVATE_KEY,
			{ expiresIn: '2hr' },
			(err, token) => {
				if (err) {
					reject('Could not generate token');
				}
				resolve(token);
			}
		);
	});
}
