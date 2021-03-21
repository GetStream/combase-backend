import { sourceImgix } from './source-imgix';

export const addSourceImgix = sourceImgix(process.env.IMG_URL);

export const extend = tc => {
	tc.setIsTypeOf(value => value._id);
};
