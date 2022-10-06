import jwt from 'jsonwebtoken';

function validateJwt(req, res, next) {
	const token = req.headers['x-token'];

	if (!token) {
		return res.status(401).json({
			status: 'failed',
			error: {
				token: {
					message: '"Token" has not been sent',
				},
			},
		});
	}

	try {
		const { id, name, email } = jwt.verify(
			token,
			process.env.JWT_PRIVATE_KEY
		);
		req.user = {
			id,
			name,
			email,
		};
		next();
	} catch (error) {
		return res.status(401).json({
			status: 'failed',
			error: {
				token: {
					message: '"Token" is not valid',
				},
			},
		});
	}
}

export default validateJwt;
