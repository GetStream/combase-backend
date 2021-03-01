export const extend = tc => {
	tc.addRelation('parentOrganization', {
		prepareArgs: {
			_id: ({ organization }) => organization.toString(),
		},
		projection: { organization: true },
		resolver: tc.schemaComposer.getOTC('Organization').mongooseResolvers.findById(),
	});
};
