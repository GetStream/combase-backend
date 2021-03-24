import { createChildTagRelationship } from 'utils/createTaggableEntity';

export const fields = tc => {
	tc.addFields({
		title: {
			type: 'String',
			projection: {
				content: true,
			},
			resolve: ({ content }) => content?.[0]?.children?.[0]?.children?.[0]?.text,
		},
	});
};

export const childTags = createChildTagRelationship;
