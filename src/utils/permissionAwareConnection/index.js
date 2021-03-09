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
 * Create a connection resolver that uses the source object as the filter. (i.e. source.space will scope all results that have space === source.space)
 * @param {Object} filter - merged with the source object and eventually becomes the mongo query filter
 */
const permissionAwareConnection = (tc, resolverOpts = {}, opts) => {
	if (!opts) throw new Error('No options provided to permissionAwareConnection');

	return tc.mongooseResolvers.connection(resolverOpts).wrapResolve(next => rp => {
		const filter = getPermissionsScopes(rp, opts);

		// eslint-disable-next-line no-param-reassign
		rp.args = deepmerge(rp.args, { filter });

		return next(rp);
	});
};

/**
 * Create a findById resolver that uses the source object as the filter. (i.e. source.space will scope all results that have space === source.space)
 * @param {Object} filter - merged with the source object and eventually becomes the mongo query filter
 */
const permissionAwareFindById = (tc, resolverOpts = {}, opts) => {
	if (!opts) throw new Error('No options provided to permissionAwareConnection');

	return tc.mongooseResolvers.findById(resolverOpts).wrapResolve(next => rp => {
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
export const createPermissionAwareRelationship = (parentTC, childTC, opts) => {
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
			[opts?._idField]: true,
		},
		resolver: permissionAwareConnection(
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
			[opts?._idField]: true,
		},
		resolver: permissionAwareFindById(
			childTC,
			{ name: findByIdResolverName },
			{
				_idField: parentField,
				schemaComposer: parentTC.schemaComposer,
			}
		),
	});
};
