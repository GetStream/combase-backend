export const asset = tc =>
	tc.mongooseResolvers.findById().clone({
		name: 'get',
		type: 'AssetInterface',
	});
export const imageAsset = tc =>
	tc.mongooseResolvers.findById().clone({
		name: 'getImage',
		type: 'ImgixAsset',
	});
export const assets = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
