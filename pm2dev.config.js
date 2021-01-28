module.exports = {
	apps: [
		{
			name: 'combase-api',
			script: 'dist/api/index.js',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			watch: true,
			ignore_watch: ['.git', 'node_modules'],
		},
	],
};
