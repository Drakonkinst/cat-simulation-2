const Chance = (function() {
    return {
        // min inclusive, max exclusive
        randNum(min, max) {
            return Math.random() * (max - min) + min;
        },
        
        // min inclusive, max exclusive
        randInt(min, max) {
            return ~~Chance.randNum(min, max);
        },
        
        chooseRandom(array) {
            return array[Chance.randInt(0, array.length)];
        },
        
        chance(chance) {
            return Math.random() < chance;
        },
        
        // defaults to key's value if weightProperty is not specified
        chooseWeighted(choiceMap, weightProperty) {
            let totalWeight = 0;
            let key;
            
            for(key in choiceMap) {
                if(choiceMap.hasOwnProperty(key)) {
                    if(!_.isUndefined(weightProperty)) {
                        totalWeight += parseFloat(choiceMap[key][weightProperty]);
                    } else {
                        totalWeight += parseFloat(choiceMap[key]);
                    }
                }
            }
            
            let rand = Chance.randNum(0, totalWeight);
            let weightCount = 0;
            
            for(key in choiceMap) {
                if(choiceMap.hasOwnProperty(key)) {
                    if(!_.isUndefined(weightProperty)) {
                        weightCount += parseFloat(choiceMap[key][weightProperty]);
                    } else {
                        weightCount += parseFloat(choiceMap[key]);
                    }
                    if(rand < weightCount) {
                        return key;
                    }
                }
            }
            Logger.warn("No choice found!");
            return null;
        }
    };
})();