/* eslint-disable */
module.exports = {
	apps: [
		{
			name: 'api',
			script: '-r dotenv/config dist/index.js dotenv_config_path=../../.env',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			instances: process.env.WEB_CONCURRENCY || 2,
			exec_mode: 'cluster',
			autorestart: true,
			watch: false,
		},
	],
};
