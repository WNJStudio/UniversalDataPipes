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

const KILOBYTES = 1024;
const MEGABYTES = KILOBYTES * 1024;
const GIGABYTES = MEGABYTES * 1024;

/**
 * Formats Bytes into a String x B/KB/MB/GB
 * @param {number} v
 */
export const bytesToString = (v) => {
    if (v === 0) {
        return "0 bytes";
    }
    let rem = v;
    const gb = ~~(rem / GIGABYTES);
    if (gb > 0) {
        return `${gb} GB`;
    }
    rem = rem % GIGABYTES;
    const mb = ~~(rem / MEGABYTES);
    if (mb > 0) {
        return `${mb} MB`;
    }
    rem = rem % MEGABYTES;
    const kb = ~~(rem / KILOBYTES);
    if (kb > 0) {
        return `${kb} KB`;
    }
    rem = rem % KILOBYTES;
    return `${rem} bytes`;
};
