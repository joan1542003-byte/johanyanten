// One motion language for the whole site: unhurried, no bounce, little blur

/** Long, soft ease-out: quick to respond, slow to settle */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = { quick: 0.35, base: 0.9, slow: 1.2 } as const;

/** Critically damped spring for sliding indicators and pills */
export const calm = { type: "spring", stiffness: 170, damping: 28, mass: 1 } as const;
