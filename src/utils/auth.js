const getTokenPayload = (account, type) => ({
	organization: account.organization.toString(),
	sub: account._id.toString(),
	type,
});

export { getTokenPayload };
