import path from 'path';
import slash from 'slash';
import fs from 'fs-extra';

import { createPluginGraphQLClient } from './createPluginGraphQLClient';
import { logger } from 'utils/logger';

const mapPluginMethodsToTriggers = (plugin, { triggers }) => {
	const obj = {};

	Object.entries(triggers).forEach(([trigger, methodName]) => {
		obj[trigger] = plugin[methodName];
	});

	return obj;
};

const gql = createPluginGraphQLClient();

const createPlugin = pluginTriggerMap => {
	return class DynamicPlugin {
		constructor(capn) {
			this.capn = capn;
			this.triggers = Object.keys(pluginTriggerMap);

			Object.entries(pluginTriggerMap)
				.filter(([trigger, method]) => trigger && method)
				.forEach(([trigger, method]) => {
					this[trigger] = method;
				});

			this.listen();
		}

		authenticateRequest = event => {
			const headers = {};
			const org = event?.data?.fullDocument?.organization;

			// eslint-disable-next-line multiline-comment-style
			// if (token) {
			// 	headers.Authorization = `Bearer ${token}`;
			// }

			if (org) {
				headers['combase-organization'] = org.toString();
			}

			return headers;
		};

		actions(event) {
			return {
				request: (document, variables) => gql.request(document, variables, this.authenticateRequest(event)),
			};
		}

		listen = async () => {
			for await (const event of this.capn.listen(this.triggers)) {
				try {
					await this[event.trigger]?.(event, this.actions(event));
				} catch (error) {
					logger.error(error);
				}
			}
		};
	};
};

export const createDynamicPlugins = () => {
	// eslint-disable-next-line no-sync
	const pluginConfigs = JSON.parse(fs.readFileSync(slash(path.join(process.cwd(), '.data', 'integration-manifest.json'))));
	const plugins = pluginConfigs.map(({ internal }) => require(internal.path));

	const triggerMap = plugins.map((plugin, i) => mapPluginMethodsToTriggers(plugin, pluginConfigs[i]));

	const pluginObjects = triggerMap.map(createPlugin);

	return pluginObjects;
};
