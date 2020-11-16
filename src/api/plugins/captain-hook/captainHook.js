export const captainHook = plugins => {
	const hook = {
		plugins,
		receive: (req, res, next) => {
			plugins.forEach(({ receive }) => receive && receive(req, res, next));
			next();
		},
	};

	return hook;
};
