import { paramCase } from 'param-case';

export const objectKeysToParamCase = args => {
	let key;
	const keys = Object.keys(args);
	const output = {};

	let n = keys.length;

	while (n--) {
		key = keys[n];
		output[paramCase(key)] = args[key];
	}

	return output;
};
