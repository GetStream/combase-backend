const path = require('path');

export const captainHook = pluginConfig => {
	const plugins = pluginConfig.map(plugin => {
		let options = {};
		let resolve = '';

		if (typeof plugin === 'string') {
			resolve = plugin;
		} else if (plugin.resolve) {
			resolve = plugin.resolve;
			options = plugin?.options || {};
		} else {
			throw new Error(`Invalid Captain Hook Plugin: ${plugin}`);
		}

		if (!resolve.startsWith('@captain-hook/')) {
			throw new Error(`Invalid Captain Hook Plugin: ${plugin}`);
		}

		const pluginName = resolve.replace('@captain-hook/', '');

		const Plugin = require(path.join(__dirname, `./plugins/${pluginName}`)).default;

		return new Plugin(options);
	});

	const hook = {
		plugins,
		receive: (req, res, next) => {
			plugins.forEach(({ receive }) => receive && receive(req, res, next));
			next();
		},
	};

	return hook;
};
