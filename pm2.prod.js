module.exports = {
	apps: [
		{
			name: 'combase-api',
			script: 'dist/api/index.js',
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
