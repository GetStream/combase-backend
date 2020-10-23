/* eslint-disable */
module.exports = {
	apps: [
		{
			name: 'worker',
			script: 'src/index.js',
			output: '/dev/stdout',
			error: '/dev/stderr',
			merge_logs: true,
			interpreter: 'babel-node',
			watch: true,
			ignore_watch: ['.git', 'node_modules'],
		},
	],
};
