import schemaComposer from 'api/schema/composer';

const StreamActivityTC = schemaComposer.getOTC('StreamActivity');
const StreamActivityITC = schemaComposer.getITC('StreamAddActivityInput');

StreamActivityTC.addFields({
	entity: 'String!',
	text: 'String',
});

StreamActivityITC.addFields({
	entity: 'String!',
	text: 'String',
});
