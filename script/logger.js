/* 
 * Logger object that wraps the default console.log method.
 * */
const Logger = (function() {
    const DEFAULT_CATEGORY = "Process";
    
    const Timings = {};
    let lastTimingCategory = DEFAULT_CATEGORY;
    
    function checkDebugLevel(value) {
        return value >= Config.DebugLevel;
    }
    
    function now() {
        return new Date().getTime();
    }

    return {
        log(msg) {
            if(checkDebugLevel(0)) {
                console.log(msg);
            }
        },
        
        warn(msg) {
            if(checkDebugLevel(1)) {
                console.warn(msg);
            };
        },
        
        error(msg, shouldThrow) {
            shouldThrow = shouldThrow || false;
            if(checkDebugLevel(2)) {
                if(shouldThrow) {
                    throw new Error(msg);
                } else {
                    console.error(msg);
                }
            };
        },
        
        logIf(condition, msg, priority) {
            if(condition) {
                Logger.log(msg, priority);
            }
        },
        
        warnIf(condition, msg) {
            if(condition) {
                Logger.warn(msg);
            }
        },
        
        errorIf(condition, msg, shouldThrow) {
            if(condition) {
                Logger.error(msg, shouldThrow);
            }
        },
        
        startTiming(category) {
            category = category || lastTimingCategory;
            Timings[category] = now();
            lastTimingCategory = category;
        },
        
        mark(category) {
            category = category || lastTimingCategory;
            if(!Timings.hasOwnProperty(category)) {
                return;
            }
            let oldTime = Timings[category];
            let currTime = now();
            Logger.log(category + " took " + (currTime - oldTime) + "ms");
            Timings[category] = currTime;
            lastTimingCategory = category;
        }
    };
})();