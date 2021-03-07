/**
 * Static class for helper functions.
 */
const Utils = (() => {
    return {
        /* PROBABILITIES */
        
        /**
         * Returns a boolean given the chance for the boolean to be true.
         * 
         * @param {number} probability The probability to return true [0.0, 1.0] 
         * @returns {boolean} A boolean
         */
        chance(probability) {
            return Math.random() < probability;
        },
        
        /**
         * Returns an integer between min and max, not including max.
         * Does not work properly for negative numbers.
         * 
         * @param {number} min The minimum integer.
         * @param {number} max The maximum integer.
         * @returns {number} An integer between min and max, not including max.
         */
        randInt(min, max) {
            return Math.floor(Utils.randNum(min, max))
        },
        
        /**
         * Returns a number between min and max.
         * 
         * @param {number} min The mininmum number.
         * @param {number} max The maximum number.
         * @returns {number} A number between min and max.
         */
        randNum(min, max) {
            if(min == max) {
                return min;
            }
            return Math.random() * (max - min) + min;
        },
        
        /**
         * Returns a randomly selected item from an array.
         * @param {Array} arr An array.
         * @returns {*} A random element from the array.
         */
        chooseRandom(arr) {
            return arr[Utils.randInt(0, arr.length)];
        },
        
        chooseWeighted(choiceMap, weightProp = null) {
            // sum weights
            let weightSum = 0;
            for(let k in choiceMap) {
                if(choiceMap.hasOwnProperty(k)) {
                    if(weightProp != null) {
                        // look for weight property
                        weightSum += parseFloat(choiceMap[k][weightProp]);
                    } else {
                        // no weight property, parse float directly
                        weightSum += parseFloat(choiceMap[k]);
                    }
                }
            }
            
            // choose random number based on total weight, then find
            // which item it corresponds to
            let rand = Utils.randNum(0, weightSum);
            let currentSum = 0;
            
            for(let k in choiceMap) {
                if(choiceMap.hasOwnProperty(k)) {
                    if(weightProp != null) {
                        // look for weight property
                        currentSum += parseFloat(choiceMap[k][weightProp]);
                    } else {
                        // no weight property, parse float directly
                        currentSum += parseFloat(choiceMap[k]);
                    }
                    if(rand < currentSum) {
                        return k;
                    }
                }
            }
            
            console.warn("No choice found!");
            return null;
        },
        
        /* ENCODING/DECODING */
        
        encodeBoolean(bool) {
            return bool ? "1" : "0";
        },
        
        // Assumes item exists, encodes by returning index
        encodeArrayIndex(keyArr, item) {
            return keyArr.indexOf(item);
        },
        
        encodeBooleanArray(keyArr, valueArr) {
            let result = [];
            for(let item of keyArr) {
                if(valueArr.includes(item)) {
                    result.push(1);
                } else {
                    result.push(0);
                }
            }
            return result.join("");
        },
        
        decodeBoolean(str) {
            let val = parseInt(str);
            return val != 0;
        },
        
        decodeArrayIndex(keyArr, str) {
            let index = parseInt(str);
            return keyArr[index];    
        },
        
        decodeBooleanArray(keyArr, str) {
            let result = [];
            for(let i = 0; i < keyArr.length; ++i) {
                let val = str[i];
                if(val == "1") {
                    result.push(keyArr[i]);
                }
            }
            return result;
        },
        
        /* COMPRESS/DECOMPRESS DATA */
        
        /**
         * Compresses string for storage
         * Source: Cookie Clicker (thanks Orteil!)
         * 
         * @param {string} str original string
         * @return {string} compressed string
         */
        compressData(str) {
            try {
                return LZString.compress(unescape(encodeURIComponent(str)));
            } catch(err) {
                return "";
            }
        },

        /**
         * Decompresses string
         * 
         * @param {string} str compressed string 
         * @return {string} original string
         */
        decompressData(str) {
            try {
                return decodeURIComponent(escape(LZString.decompress(str)));
            } catch(err) {
                return "";
            }
        },

        /**
         * Encodes string into UTF-8 then compresses it to base 64
         * 
         * @param {string} str original string
         * @return base 64 string
         */
        utf8ToBase64(str) {
            try {
                return LZString.compressToBase64(unescape(encodeURIComponent(str)));
            } catch(err) {
                return "";
            }
        },

        /**
         * Decodes string from base 64 to UTF-8
         * 
         * @param {string} str base 64 string
         * @return UTF-8 string
         */
        base64ToUtf8(str) {
            try {
                return decodeURIComponent(escape(LZString.decompressFromBase64(str)));
            } catch(err) {
                return "";
            }
        },
    
        /* MISC */
        
        /**
         * Returns a list of an object's keys.
         * 
         * @param {Object} object The object.
         * @returns A list of the object's keys.
         */
        keysAsList(object) {
            let keys = [];
            for(let key in object) {
                if(object.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        },
        
        /**
         * Comprehensive null check, useful for checking existence
         * of booleans when the usual shorthand does not work.
         * 
         * @param {*} value The value to check. 
         * @returns True if this value is undefined.
         */
        isUndefined(value) {
            return typeof value === "undefined" || value == null;
        },
        
        roundNum(value, precision = 2) {
            return +value.toFixed(precision);
        },
        
        mergeObjects(target, source) {
            for(let k in source) {
                target[k] = source[k];
            }
        }
    };
})();

/**
 * Logger class for logging messages.
 */
const Logger = (() => {
    function shouldPrint() {
        if(!Game || !Game.settings) {
            return false;
        }
        return Game.settings.debugMode;
    }
    
    return {
        log(msg) {
            if(shouldPrint()) {
                console.log(msg);
            }
        },
        
        warn(msg) {
            if(shouldPrint()) {
                console.warn(msg);
            }
        }
    }
})();