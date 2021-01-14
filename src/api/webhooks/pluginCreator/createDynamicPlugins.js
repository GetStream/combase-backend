import path from 'path';
import slash from 'slash';
import fs from 'fs-extra';

import { createPluginObject } from './createPluginObject';

const mapPluginMethodsToTriggers = (plugin, { triggers }) => {
	const obj = {};

	// Replaces method names with the _actual_ method from the plugins exports.
	Object.entries(triggers).forEach(([trigger, methodName]) => {
		obj[trigger] = plugin[methodName];
	});

	return obj;
};

export const createDynamicPlugins = () => {
	// eslint-disable-next-line no-sync
	const pluginConfigs = JSON.parse(fs.readFileSync(slash(path.join(process.cwd(), '.data', 'integration-manifest.json'))));
	const plugins = pluginConfigs.map(({ internal }) => require(internal.path));
	const triggerMap = plugins.map((plugin, i) => mapPluginMethodsToTriggers(plugin, pluginConfigs[i]));

	const pluginObjects = triggerMap.map(createPluginObject);

	return pluginObjects;
};
