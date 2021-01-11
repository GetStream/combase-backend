const slash = require('slash');
const path = require('path');
const fs = require('fs-extra');

const config = require('../combase.config');

// const installPlugins = require('./installPlugins');
const loadPlugins = require('./loadPlugins');

const dataDir = path.join(process.cwd(), '.data');

(async () => {
	await fs.ensureDir(slash(dataDir));

	/*
	 * TODO: Currently commented as we are synlinking the plugin pkgs
	 * if (process.env.NODE_ENV === 'production') {
	 * 	await installPlugins();
	 * }
	 */

	const plugins = await loadPlugins(config);

	// eslint-disable-next-line no-sync
	await fs.writeFile(slash(path.join(dataDir, 'integration-manifest.json')), JSON.stringify(plugins));
})();
