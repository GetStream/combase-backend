import schemaComposer from 'api/schema/composer';

const StreamActivityTC = schemaComposer.getOTC('StreamActivity');
const StreamActivityITC = schemaComposer.getITC('StreamAddActivityInput');

const StreamActivityEntityETC = schemaComposer.createEnumTC(`
	enum StreamActivityEntity {
		Agent
		Organization
		Ticket
		User
	}
`);

StreamActivityTC.addFields({
	entity: StreamActivityEntityETC,
	text: 'String',
});

StreamActivityITC.addFields({
	entity: StreamActivityEntityETC,
	text: 'String',
});
