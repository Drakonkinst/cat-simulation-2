const Helpers = (function() {
    return {
        isUndefined(variable) {
            return typeof variable === "undefined" || variable === null;
        },
        
        hasNoProperties(object) {
            for(let key in object) {
                if(object.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },
        
        itemInArray(array, item, ignoreCase) {
            if(ignoreCase) {
                item = item.toUpperCase();
                array = array.map(function(value) {
                    return value.toUpperCase();
                });
            }
            return array.includes(item);
        }
    };
})();
// alias
const _ = Helpers;