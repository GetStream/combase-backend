import p from 'phin';
import { createImgixUrlResolver } from './resolvers';

export const sourceImgix = domain => tc => {
	const composer = tc.schemaComposer;
	const ImgixAssetTC = composer.createObjectTC(`
		type ImgixAsset implements AssetInterface {
			_id: MongoID!
			ref: String!
			source: EnumAssetSource!
			organization: MongoID!
			type: EnumAssetType!
		}
	`);

	ImgixAssetTC.addFields({
		url: createImgixUrlResolver(ImgixAssetTC, domain),
	});

	ImgixAssetTC.addRelation('dimensions', {
		prepareArgs: {
			fm: 'json',
		},
		resolver: () =>
			createImgixUrlResolver(ImgixAssetTC, domain)
				.wrap(resolver => {
					// eslint-disable-next-line no-param-reassign
					resolver.args = {};

					return resolver;
				})
				.wrapResolve(next => async rp => {
					// eslint-disable-next-line callback-return
					const url = await next(rp);

					const { body } = await p({
						method: 'get',
						parse: 'json',
						timeout: 3000,
						url,
					});

					return {
						width: body.PixelWidth,
						height: body.PixelHeight,
						aspect: body.PixelWidth / body.PixelHeight,
					};
				})
				.setType('JSON'),
	});

	ImgixAssetTC.setIsTypeOf(value => value?.type === 'image');
	composer.addSchemaMustHaveType(ImgixAssetTC);
};
