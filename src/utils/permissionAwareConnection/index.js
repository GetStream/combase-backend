import { deepmerge, pluralize } from 'graphql-compose';

const getPermissionsScopes = ({ source, context }, opts) => {
	const { _id } = source;
	// eslint-disable-next-line no-unused-vars
	const { agent, access, organization } = context;

	if (context.user || _id.toString() !== organization.toString()) {
		throw new Error(`Unauthorized`);
	}

	// _idField === 'organization'
	const scopes = { [opts._idField]: _id.toString() };

	// super_admin admin moderator guest

	return scopes;
};

/**
 * Create a `list` resolver that uses the source object as the filter. (i.e. source.organization will scope all results that have organization === source.organization)
 * @param {Object} filter - merged with the source object and eventually becomes the mongo query filter
 */
const permissionAwareList = (tc, resolverOpts = {}, opts) => {
	if (!opts) throw new Error('No options provided to permissionAwareList');

	return tc
		.getResolver('list')
		.clone(resolverOpts)
		.wrapResolve(next => rp => {
			const filter = getPermissionsScopes(rp, opts);

			// eslint-disable-next-line no-param-reassign
			rp.args = deepmerge(rp.args, { filter });

			return next(rp);
		});
};

/**
 * Create a `get` resolver that uses the source object as the filter. (i.e. source.organization will scope all results that have organization === source.organization)
 * @param {Object} filter - merged with the source object and eventually becomes the mongo query filter
 */
const permissionAwareGet = (tc, resolverOpts = {}, opts) => {
	if (!opts) throw new Error('No options provided to permissionAwareGet');

	return tc
		.getResolver('get')
		.clone(resolverOpts)
		.wrapResolve(next => rp => {
			const filter = getPermissionsScopes(rp, opts);

			// eslint-disable-next-line no-param-reassign
			rp.args = deepmerge(rp.args, { filter });

			return next(rp);
		});
};

/**
 * Create a search resolver that uses the source object as the filter. (i.e. source.organization will scope all results that have organization === source.organization)
 * @param {Object} filter - merged with the source object and eventually becomes the mongo query filter
 */
const permissionAwareSearch = (tc, resolverOpts = {}, opts) => {
	if (!opts) throw new Error('No options provided to permissionAwareSearch');

	return tc
		.getResolver('search')
		.clone(resolverOpts)
		.wrapResolve(next => rp => {
			const filter = getPermissionsScopes(rp, opts);

			// eslint-disable-next-line no-param-reassign
			rp.args = deepmerge(rp.args, { filter });

			return next(rp);
		});
};

/*
 * ParentTC === Organization
 * ChildTC === Ticket | Agent | Faq | Group | Webhook | ...
 */
export const createPermissionAwareRelationship = (parentTC, childTC, opts = {}) => {
	const parentTypeName = parentTC.getTypeName();
	const parentField = parentTypeName.toLowerCase();

	const childTypeName = childTC.getTypeName();
	const relatedFieldName = childTypeName.toLowerCase();
	const relatedFieldNamePlural = pluralize(relatedFieldName);

	const findByIdResolverName = `${parentTypeName}`;
	const connectionResolverName = `${parentTypeName}`;

	parentTC.addRelation(relatedFieldNamePlural, {
		prepareArgs: {},
		projection: {
			_id: true,
		},
		resolver: () =>
			permissionAwareList(
				childTC,
				{ name: connectionResolverName },
				{
					_idField: parentField,
					schemaComposer: parentTC.schemaComposer,
				}
			),
	});

	parentTC.addRelation(relatedFieldName, {
		prepareArgs: {},
		projection: {
			_id: true,
		},
		resolver: () =>
			permissionAwareGet(
				childTC,
				{ name: findByIdResolverName },
				{
					_idField: parentField,
					schemaComposer: parentTC.schemaComposer,
				}
			),
	});

	if (opts?.search) {
		parentTC.addRelation(`${relatedFieldName}Search`, {
			prepareArgs: {},
			projection: {
				_id: true,
			},
			resolver: () =>
				permissionAwareSearch(
					childTC,
					{ name: findByIdResolverName },
					{
						_idField: parentField,
						schemaComposer: parentTC.schemaComposer,
					}
				),
		});
	}
};
