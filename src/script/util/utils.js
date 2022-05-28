
/* Probability */
/**
 * Returns a boolean given the chance for the boolean to be true.
 * 
 * @param {number} chance The probability to return true [0.0, 1.0].
 * @returns {boolean} A boolean.
 */
export function chance(chance) {
    return Math.random() < chance;
}

/**
 * Returns a number between min and max.
 * 
 * @param {number} min The mininmum number.
 * @param {number} max The maximum number.
 * @returns {number} A number between min and max.
 */
export function randNum(min, max) {
    if(min == max) {
        return min;
    }
    return Math.random() * (max - min) + min;
}

/**
         * Returns an integer between min and max, not including max.
         * Does not work properly for negative numbers.
         * 
         * @param {number} min The minimum integer.
         * @param {number} max The maximum integer.
         * @returns {number} An integer between min and max, not including max.
         */
export function randInt(min, max) {
    return Math.floor(randNum(min, max))
}

/**
 * Returns a randomly selected item from an array.
 * @param {Array} arr An array.
 * @returns {*} A random element from the array.
 */
export function chooseRandom(arr) {
    return arr[randInt(0, arr.length)];
}

export function round(value, precision = 2) {
    return +value.toFixed(precision);
}