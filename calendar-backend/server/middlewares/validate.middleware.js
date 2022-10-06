function validate(schema) {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body);

		if (!!error) {
			return res.status(400).json({
				status: 'failed',
				error: error.details.reduce((acc, o) => {
					acc[o.context.key] = o;
					return acc;
				}, {}),
			});
		}

		req.body = value;

		next();
	};
}

export default validate;
