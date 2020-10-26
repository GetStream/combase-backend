import p from 'phin';
import sha256 from 'crypto-js/sha256';
import { rabbit } from '@utils/db';

const webhook = async () => {
	try {
		const broker = await rabbit();

		broker
			.on('blocked', error => {
				throw new Error(error);
			})
			.on('error', error => {
				throw new Error(error);
			});

		const subscription = await broker.subscribe('webhook');

		subscription
			.on('message', (message, content, ackOrNack) => {
				const { url, token, payload } = content;

				// eslint-disable-next-line get-off-my-lawn/prefer-arrow-functions
				(async function () {
					const { statusCode: code } = await p({
						url,
						method: 'POST',
						headers: {
							'x-signature': sha256(token, payload),
						},
						data: content,
					});

					if (code !== 200) {
						ackOrNack([
							{
								strategy: 'republish',
								defer: 1000,
								attempts: 10,
							},
							{
								strategy: 'nack',
							},
						]);
					} else {
						ackOrNack({ strategy: 'ack' });
					}
				})();
			})
			.on('error', error => {
				throw new Error(error);
			})
			.on('redeliveries_exceeded', (error, message, ackOrNack) => {
				ackOrNack(error, { strategy: 'nack' });
				throw new Error(error);
			})
			.on('invalid_content', (error, message, ackOrNack) => {
				ackOrNack(error, { strategy: 'nack' });
				throw new Error(error);
			});
	} catch (error) {
		throw new Error(error);
	}
};

export { webhook };
