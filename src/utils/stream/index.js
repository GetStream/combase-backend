import { clientWrapper } from './clientWrapper';
import { tokenGenerator } from './tokenGenerator';

export default {
	StreamClients: clientWrapper(),
	StreamTokens: tokenGenerator(),
};
