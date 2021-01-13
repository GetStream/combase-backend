import path from 'path';
import slash from 'slash';
import fs from 'fs-extra';

const mapPluginMethodsToTriggers = (plugin, { triggers }) => {
	const obj = {};

	Object.entries(triggers).forEach(([trigger, methodName]) => {
		obj[trigger] = plugin[methodName];
	});

	return obj;
};

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

		listen = async () => {
			for await (const event of this.capn.listen(this.triggers)) {
				this[event.trigger]?.(event);
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
