const execa = require('execa');
const { plugins } = require('../combase.config.js');

module.exports = async () => {
	if (plugins.length === 0 || !plugins || !Array.isArray(plugins)) {
		process.exit(1);
	}

	const subprocess = execa('yarn', ['add', ...plugins, '--no-save']);

	try {
		subprocess.stdout.pipe(process.stdout);

		await subprocess;
	} catch (error) {
		process.exit(1);
	}
};
