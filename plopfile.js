// eslint-disable-next-line get-off-my-lawn/prefer-arrow-functions
module.exports = function (plop) {
	plop.setGenerator('plugin', {
		description: 'generates a plugin skeleton in src/plugins',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of your plugin?',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/plugins/{{name}}-plugin.js',
				templateFile: 'plop-templates/plugin.hbs',
			},
		],
	});
};
