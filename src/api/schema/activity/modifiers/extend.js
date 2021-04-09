export const fields = tc => {
	const StreamActivityIFTC = tc.schemaComposer.getIFTC('StreamActivityInterface');
	
	const StreamActivityEntityETC = tc.schemaComposer.createEnumTC(`
		enum StreamActivityEntity {
			Agent
			Organization
			Ticket
			User
		}
	`);

	StreamActivityIFTC.addFields({
		actor: 'MongoID!',
		entity: StreamActivityEntityETC,
		object: 'MongoID!',
	})

	tc.addFields({
		actor: 'MongoID!',
		entity: StreamActivityEntityETC,
		text: 'String',
		object: 'MongoID!',
	});
};