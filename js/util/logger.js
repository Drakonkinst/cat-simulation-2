const Logger = (() => {
    let shouldPrint = true;
    
    return {
        enable() {
            shouldPrint = true;
        },
        
        disable() {
            shouldPrint = false;    
        },
        
        log(msg) {
            if(shouldPrint) {
                console.log(msg.toLowerCase());
            }
        },
        
        warn(msg) {
            if(shouldPrint) {
                console.warn(msg.toLowerCase());
            }
        },
        
        error(msg) {
            if(shouldPrint) {
                console.error(msg.toLowerCase());
            }
        }
    }
})();