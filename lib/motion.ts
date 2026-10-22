// One motion language for the whole site: unhurried, no bounce, never cut short

/** Long, soft ease-out: quick to respond, slow to settle */
export const ease = [0.22, 1, 0.36, 1] as const;

/** Entrances take their time; exits are shorter but still visible */
export const duration = { enter: 1, exit: 0.5, hover: 0.6 } as const;

/** Critically damped spring for sliding indicators: settles without wobbling */
export const calm = { type: "spring", stiffness: 120, damping: 22, mass: 1 } as const;
