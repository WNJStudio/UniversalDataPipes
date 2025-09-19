/**
 * Clamps a value within the boundaries
 * @param {number} v
 * @param {number} min
 * @param {number} max
 * @returns
 */
export const clamp = (v, min, max) => {
    return Math.min(max, Math.max(min, v));
};

/**
 * Rounds a value to the nearest multiple
 * @param {number} v
 * @param {number} mult
 * @returns
 */
export const roundMult = (v, mult) => {
    if (mult === 0) {
        return v;
    }
    return Math.round(v / mult) * mult;
};
