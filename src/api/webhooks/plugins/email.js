import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import parser from '@sendgrid/inbound-mail-parser';
import mongoose from 'mongoose';
import { StreamChat } from 'stream-chat';

import { Models } from 'api/schema';
import { logger } from 'utils/logger';

export class CombaseEmailPlugin {
	// eslint-disable-next-line no-unused-vars
	handleWebhook = async data => {
		try {
			const transporter = nodemailer.createTransport(
				sgTransport({
					auth: {
						api_key: process.env.SENDGRID_API_KEY,
					},
				})
			);

			switch (data?.type) {
				case 'email.inbound': {
					const email = await transporter.sendMail({
						from: '"Fred Foo 👻" <foo@example.com>', // sender address
						to: 'bar@example.com, baz@example.com', // list of receivers
						subject: 'Hello ✔', // Subject line
						html: '<b>Hello world?</b>', // html body
					});

					return email;
				}

				case 'email.outbound': {
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

	// data === req.body
	// eslint-disable-next-line no-unused-vars
	test = ({ data }) => true;

	listen = async capn => {
		const events = capn.listen(this.test);

		try {
			for await (const event of events) {
				// eslint-disable-next-line no-console
				logger.info('CombaseEmailPlugin:', event);
				await this.handleWebhook(event);
			}
		} catch (error) {
			logger.error(error);
		}
	};
}
