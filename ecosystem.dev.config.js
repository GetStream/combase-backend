/* eslint-disable */
module.exports = {
	apps: [
		{
			name: 'api',
			script: '-r dotenv/config src/api/index.js',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			interpreter: 'babel-node',
			watch: true,
			ignore_watch: ['.git', 'node_modules'],
		},
		{
			name: 'worker',
			script: '-r dotenv/config src/worker/index.js',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			interpreter: 'babel-node',
			watch: true,
			ignore_watch: ['.git', 'node_modules'],
		},
	],
};
