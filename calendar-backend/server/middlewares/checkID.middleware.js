function checkID(Model, name) {
	return async (req, res, next) => {
		const { id } = req.params;

		try {
			const doc = await Model.findById(id);

			if (!doc) {
				return res.status(404).json({
					status: 'failed',
					error: {
						message: `"${name}" not found`,
					},
				});
			}

			req.document = doc;
			next();
		} catch (error) {
			return res.status(500).json({
				status: 'failed',
				error: { ...error, reason: error.reason.message },
			});
		}
	};
}

export default checkID;
