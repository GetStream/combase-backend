export const extend = tc => {
	tc.addRelation('userData', {
		prepareArgs: {
			_id: ({ user }) => user,
		},
		projection: { user: true },
		resolver: () => tc.schemaComposer.getOTC('User').getResolver('get'),
	});
};
