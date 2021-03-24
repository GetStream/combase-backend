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

			/*
			 * If the 'modifiers' in this pass a singular modifier,
			 * just run it without flattening anything
			 */
			if (typeof modifiers === 'function') {
				createResolverIfReturn(modifiers, tc);
			}

			Object.values(modifiers)
				.flatMap(returnFuncFlattenObject)
				.forEach(fn => createResolverIfReturn(fn, tc));

			return tc;
		}, null)
	);

export default chain;
