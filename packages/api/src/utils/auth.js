// Generate the JWT Payload for a Dashboard User (Agent/Moderator/Admin)
export const getTokenPayload = account => ({
	organization: account.organization.toString(),
	sub: account._id.toString(),
});