export const chatCommandsHandler = (req, res) => {
	// the body of the message we will modify based on user interactions
	const message = req.body.message;
	// eslint-disable-next-line no-unused-vars
	const user = req.body.user;

	switch (message.command) {
		case 'tag':
			message.text = `Ticket was tagged: ${message.args}`;
			message.type = 'ephemeral';
			message.display = 'system';

			break;
		case 'star':
			message.text = `Ticket was starred`;
			message.type = 'ephemeral';
			message.display = 'system';

			break;
		case 'priority':
			message.text = `Ticket was marked with priority ${message.args}`;
			message.type = 'ephemeral';
			message.display = 'system';

			break;
		default:
			break;
	}

	res.setHeader('Content-Type', 'application/json');
	res.end(
		JSON.stringify({
			message,
		})
	);
};
