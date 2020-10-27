/* eslint-disable */
module.exports = {
	apps: [
		{
			name: 'api',
			script: 'dist/api/index.js',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			instances: process.env.WEB_CONCURRENCY || 2,
			exec_mode: 'cluster',
			autorestart: true,
			watch: false,
		},
		{
			name: 'worker',
			script: 'dist/api/index.js',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			instances: process.env.WEB_CONCURRENCY || 4,
			exec_mode: 'cluster',
			autorestart: true,
			watch: false,
		},
	],
};
