module.exports = {
	apps: [
		{
			name: 'combase-api',
			script: 'src/api/index.js',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			interpreter: 'babel-node',
			watch: true,
			ignore_watch: ['.git', 'node_modules'],
		},
	],
};
