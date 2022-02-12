const Util = (() => {
    return {
        chooseRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },
        
        mergeObjects(target, source) {
            for(let k in source) {
                target[k] = source[k];
            }
        }
    }
})();