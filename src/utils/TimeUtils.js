const SECOND_MILLIS = 1000;
const MINUTE_MILLIS = SECOND_MILLIS * 60;
const HOUR_MILLIS = MINUTE_MILLIS * 60;
const DAY_MILLIS = HOUR_MILLIS * 24;

/**
 * Returns a string 'n unit', returns an empty string if discard is true and n === 0
 * @param {number} n
 * @param {string} unit
 * @param {string} unitPlural
 * @param {boolean} discard
 * @returns {string} 'n unit' or ''
 */
const withUnit = (n, unit, unitPlural = unit, discard = true) => {
    if (discard && n === 0) {
        return "";
    }
    if (n === 1) {
        return `${n} ${unit}`;
    }
    return `${n} ${unitPlural}`;
};

/**
 * Returns a string representation of the time diff
 * @param {number} past past time in milliseconds
 * @param {number} future future time in milliseconds
 * @returns {string} x days y hours z minutes h seconds
 */
export const getTimeDiff = (past, future) => {
    let diff = future - past;
    const days = ~~(diff / DAY_MILLIS);
    diff = diff % DAY_MILLIS;
    const hours = ~~(diff / HOUR_MILLIS);
    diff = diff % HOUR_MILLIS;
    const minutes = ~~(diff / MINUTE_MILLIS);
    diff = diff % MINUTE_MILLIS;
    const seconds = ~~(diff / SECOND_MILLIS);

    return [
        withUnit(days, "day", "days"),
        withUnit(hours, "hour", "hours"),
        withUnit(minutes, "minute", "minutes"),
        withUnit(seconds, "second", "seconds"),
    ].join(" ");
};
