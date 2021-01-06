import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import sgParse from '@sendgrid/inbound-mail-parser';

import { logger } from 'utils/logger';

export class CombaseEmailPlugin {
	emailEvents = ['receive', 'send'];

	handleWebhookFromEvent = async data => {
		try {
			const transporter = nodemailer.createTransport(
				sgTransport({
					auth: {
						// TODO: get value from plugins model
						api_key: process.env.SENDGRID_API_KEY,
					},
				})
			);

			switch (data?.type) {
				case 'receive': {
					logger.info('email receive event', data);

					break;
				}

				case 'send': {
					const email = await transporter.sendMail({
						from: '"Fred Foo 👻" <foo@example.com>', // sender address
						to: 'bar@example.com, baz@example.com', // list of receivers
						subject: 'Hello ✔', // Subject line
						html: '<b>Hello world?</b>', // html body
					});

					return email;
				}

				default:
					return;
			}
		} catch (error) {
			logger.error(error);
		}
	};

	test = ({ data }) => data?.type && this.emailEvents.includes(data?.type);

	listen = async capn => {
		const events = capn.listen();

		console.log(events);

		try {
			for await (const event of events) {
				await this.handleWebhookFromEvent(event);
			}
		} catch (error) {
			logger.error(error);
		}
	};
}
