import { ClientWrapper } from './ClientWrapper';
import { TokenGenerator } from './TokenGenerator';

export default {
	StreamClients: new ClientWrapper().init,
	StreamTokens: new TokenGenerator().init,
};
