import querystring from 'querystring';
import { imgixParams } from './imgixParams';
import { objectKeysToParamCase } from './utils';

export const createImgixUrlResolver = (tc, domain) =>
	tc.schemaComposer.createResolver({
		name: 'getImgixUrl',
		kind: 'query',
		description: 'Create a valid Imgix URL with configurable params from an image path.',
		type: 'String!',
		args: imgixParams,
		projection: {
			ref: true,
			source: true,
			type: true,
		},
		resolve: ({ source, args: { originalPath, ...args } }) =>
			`https://${domain}/${source.ref}?${querystring.stringify(objectKeysToParamCase(args))}`,
	});
