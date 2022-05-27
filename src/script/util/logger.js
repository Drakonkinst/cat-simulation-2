let level = 5;

export const LoggerLevel = {
    ALL: 5,
    FINE: 4,
    INFO: 3,
    WARN: 2,
    SEVERE: 1,
    NONE: 0
};

const Logger = {
    setLevel(value) {
        level = value;
    },
    
    severe(msg) {
        if(level >= 1) {
            console.error(msg);
        }
    },
    
    warn(msg) {
        if(level >= 2) {
            console.warn(msg);
        }
    },
    
    info(msg) {
        if(level >= 3) {
            console.log(msg);
        }
    },
    
    fine(msg) {
        if(level >= 4) {
            console.log(msg);
        }
    },
    
    finer(msg) {
        if(level >= 5) {
            console.log(msg);
        }
    }
};
export default Logger;