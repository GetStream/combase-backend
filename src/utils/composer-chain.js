const composerChain = step =>
	step.forEach(typeModifiers =>
		typeModifiers.reduce((tc, tcOrModifiers) => {
			if (!tc) return tcOrModifiers;

			const modifiers = tcOrModifiers;

			Object.values(modifiers)
				.flatMap(Object.values)
				.forEach(fn => {
					const resolver = fn(tc);

					if (resolver) {
						tc.addResolver(resolver);
					}
				});

			return tc;
		}, null)
	);

export default composerChain;
