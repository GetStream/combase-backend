const slash = require('slash');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const uuid = require('uuid').v4;

const hashPkg = obj => {
	const alg = 'sha256';
	const enc = 'hex';
	const data = JSON.stringify(obj);

	return crypto.createHash(alg).update(data).digest(enc);
};

const resolvePlugin = pluginName => {
	const resolvedPath = slash(path.dirname(require.resolve(path.isAbsolute(pluginName) ? pluginName : `${pluginName}/package.json`)));

	// eslint-disable-next-line no-sync
	const packageJSON = JSON.parse(fs.readFileSync(`${resolvedPath}/package.json`, `utf-8`));
	// eslint-disable-next-line no-sync
	const configJSON = JSON.parse(fs.readFileSync(`${resolvedPath}/combase.config.json`, `utf-8`));

	const internal = {
		path: resolvedPath,
		name: packageJSON.name,
		version: packageJSON.version,
	};

	return {
		...configJSON,
		internal: {
			...internal,
			hash: hashPkg(packageJSON),
		},
		id: uuid(),
	};
};

const loadPlugins = config => {
	const plugins = config.plugins.map(pluginName => resolvePlugin(pluginName));
	// TODO: need to perform some validation checks in resolvePlugin

	// TODO: We should return undefined from resolvePlugin if the plugin is malformed or invalid etc.
	return plugins.filter(plugin => Boolean(plugin));
};

module.exports = loadPlugins;
