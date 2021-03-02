export const fields = tc => {
	const StreamActivityEntityETC = tc.schemaComposer.createEnumTC(`
		enum StreamActivityEntity {
			Agent
			Organization
			Ticket
			User
		}
	`);

	tc.addFields({
		entity: StreamActivityEntityETC,
		text: 'String',
	});
};
