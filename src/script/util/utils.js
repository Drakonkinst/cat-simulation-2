
/* Probability */

import { Logger } from "./logger";

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

export function chooseWeightedMap(map) {
    let maxWeight = 0;
    for(let k in map) {
        if(map.hasOwnProperty(k)) {
            maxWeight += map[k];
        }
    }
    let targetWeight = randNum(0, maxWeight);
    let currWeight = 0;
    for(let k in map) {
        if(map.hasOwnProperty(k)) {
            currWeight += map[k];
            if(currWeight >= targetWeight) {
                return k;
            }
        }
    }
    return null;
}

export function chooseWeightedArr(arr, defaultWeight = 1, weightKey = "weight") {
    let maxWeight = 0;
    for(let item of arr) {
        if(item.hasOwnProperty(weightKey)) {
            maxWeight += item[weightKey];
        } else {
            maxWeight += defaultWeight;
        }
    }
    let targetWeight = randNum(0, maxWeight);
    let currWeight = 0;
    let index = 0;
    while(currWeight < targetWeight) {
        let item = arr[index++];
        if(item.hasOwnProperty(weightKey)) {
            currWeight += item[weightKey];
        } else {
            currWeight += defaultWeight;
        }
    }
    return arr[index - 1];
}

export function round(value, precision = 0) {
    return +value.toFixed(precision);
}

// https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
export function generateUID() {
    // I generate the UID from two parts here 
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}