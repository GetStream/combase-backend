import { createLogger, transports } from "winston";

const logger = createLogger({
  transports: [new transports.Console()],
});

export default logger;
