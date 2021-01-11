import crypto from 'crypto';

export const createObjectHash = options => obj => {
	const alg = options?.alg || 'sha256';
	const enc = options?.enc || 'hex';
	const data = JSON.stringify(obj);

	return crypto.createHash(alg).update(data).digest(enc);
};
