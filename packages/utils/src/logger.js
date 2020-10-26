import { createLogger, format, transports } from 'winston';

const logger = createLogger({
	format: format.json(),
	transports: [new transports.Console()],
});

export { logger };
