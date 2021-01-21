require('dotenv').config();

const ngrok = require('ngrok');
const open = require('open');

(async () => {
	try {
		const url = await ngrok.connect({
			proto: 'http',
			addr: process.env.PORT,
			subdomain: process.env.NGROK_SUBDOMAIN_URL,
			authtoken: process.env.NGROK_AUTH_TOKEN,
		});

		await open(ngrok.getUrl());

		async function cleanup() {
			await ngrok.kill(url);
		}

		process.on('SIGINT', cleanup);
	} catch (error) {
		console.error(error);
	}
})();
