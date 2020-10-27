import { rabbitmq } from 'utils';

const webhook = async () => {
	try {
		const broker = await rabbitmq();

		broker
			.on('blocked', error => {
				throw new Error(error);
			})
			.on('error', error => {
				throw new Error(error);
			});

		const subscription = await broker.subscribe('webhook');

		subscription
			// eslint-disable-next-line no-unused-vars
			.on('message', (message, content, ackOrNack) => {
				/*
				 * TODO: send http post with phin
				 * TODO: failures should increment database value
				 */
			})
			.on('error', error => {
				// TODO: failures should increment database value
				throw new Error(error);
			})
			.on('redeliveries_exceeded', (error, message, ackOrNack) => {
				// TODO: failures should increment database value
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
