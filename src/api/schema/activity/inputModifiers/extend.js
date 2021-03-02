export const fields = tc => {
	const StreamActivityEntityETC = tc.schemaComposer.getETC('StreamActivityEntity');

	tc.schemaComposer.getITC('StreamAddActivityInput').addFields({
		entity: StreamActivityEntityETC,
		text: 'String',
	});
};
