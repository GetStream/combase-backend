/**
 * credit where it's due to @WallToWall and `gatsby-plugin-imgix`
 * This file in particular was originally based on the awesome work done for [gatsby-plugin-imgix](https://github.com/WalltoWall/gatsby-plugin-imgix)
 * Specifically this file: https://github.com/WalltoWall/gatsby-plugin-imgix/blob/master/src/createImgixUrlParamsInputType.ts
 * 🙏 🙌
 */

import imgixUrlParameters from 'imgix-url-params/dist/parameters.json';
import { camelCase } from 'camel-case';

export const imgixParams = Object.keys(imgixUrlParameters.parameters).reduce((fields, param) => {
	const spec = imgixUrlParameters.parameters[param];

	/*
	 * The parameter names are converted to camelCase here so for the sake of GraphQL.
	 * We then convert back to param-case in the resolver that creates the URL.
	 */
	const name = camelCase(param);

	const expects = spec.expects;
	const expectsTypes = Array.from(new Set(expects.map(expect => expect.type)));

	let type;

	if (expectsTypes.every(t => t === 'integer' || t === 'unit_scalar')) {
		type = 'Int';
	} else if (expectsTypes.every(t => t === 'integer' || t === 'unit_scalar' || t === 'number')) {
		type = 'Float';
	} else if (expectsTypes.every(t => t === 'boolean')) {
		type = 'Boolean';
	} else {
		type = 'String';
	}

	// eslint-disable-next-line no-param-reassign
	fields[name] = {
		type,
		description:
			spec.short_description +
			// Ensure the description ends with a period.
			(spec.short_description.slice(-1) === '.' ? '' : '.'),
	};

	const field = fields[name];

	/*
	 * Add the default value as part of the description. Setting it as a
	 * GraphQL default value will automatically assign it in the final URL.
	 * Doing so would result in a huge number of unwanted params.
	 */
	if ('default' in spec) {
		field.description = `${field.description} Default: \`${spec.default}\`.`;
	}

	// Add Imgix documentation URL as part of the description.
	if ('url' in spec) {
		field.description = `${field.description} [See docs](${spec.url}).`;
	}

	// Create aliased fields.
	if ('aliases' in spec) {
		// eslint-disable-next-line no-unused-vars
		for (const alias of spec.aliases) {
			// eslint-disable-next-line no-param-reassign
			fields[camelCase(alias)] = {
				...field,
				description: `Alias for \`${name}\`.`,
			};
		}
	}

	return fields;
}, {});
