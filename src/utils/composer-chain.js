const returnFuncFlattenObject = value => {
	if (typeof value === 'function') {
		return value;
	}

	return Object.values(value);
};

const createResolverIfReturn = (fn, tc) => {
	const resolver = fn(tc);

	if (resolver) {
		tc.addResolver(resolver);
	}
};

const chain = step =>
	step.forEach(typeModifiers =>
		typeModifiers.reduce((tc, tcOrModifiers) => {
			if (!tc) return tcOrModifiers;

			const modifiers = tcOrModifiers;

			Object.values(modifiers)
				.flatMap(returnFuncFlattenObject)
				.forEach(fn => createResolverIfReturn(fn, tc));

			return tc;
		}, null)
	);

export default chain;
