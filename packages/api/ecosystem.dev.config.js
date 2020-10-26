/* eslint-disable */
module.exports = {
	apps: [
		{
			name: 'api',
			script: '-r dotenv/config src/index.js dotenv_config_path=../../.env',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			interpreter: 'babel-node',
			watch: true,
			ignore_watch: ['.git', 'node_modules'],
		},
	],
};
