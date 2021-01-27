require('dotenv').config();
const ora = require('ora');
const slash = require('slash');
const path = require('path');
const fs = require('fs-extra');

const config = require('../combase.config');

const installPlugins = require('./installPlugins');
const loadPlugins = require('./loadPlugins');

const dataDir = path.join(process.cwd(), '.data');

(async () => {
	await fs.ensureDir(slash(dataDir));

	let spinner;

	if (process.env.SKIP_PLUGIN_INSTALL !== 'true') {
		spinner = ora('Installing Combase plugins').start();

		await installPlugins();
	}

	const plugins = await loadPlugins(config);

	spinner.succeed();

	// eslint-disable-next-line no-sync
	await fs.writeFile(slash(path.join(dataDir, 'integration-manifest.json')), JSON.stringify(plugins));
})();
