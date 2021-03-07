

function isEqualCat(cat1, cat2) {
    for(let k in cat1) {
        if(cat1.hasOwnProperty(k) && !isEqualVal(cat1[k], cat2[k])) {
            return false;
        }
    }
    return true;
}

function isEqualVal(val1, val2) {
    if(Array.isArray(val1)) {
        if(val1.length !== val2.length) {
            return false;
        }
        for(let i = 0; i < val1.length; ++i) {
            if(!val2.includes(val1[i])) {
                return false;
            }
        }
        return true;
    } else {
        return val1 == val2;
    }
}

function testCatSavingLoading() {
    let howMany = 50;
    let numFails = 0;
    let start = Date.now();
    for(let i = 0; i < howMany; ++i) {
        let cat = new Cat();
        let savedCat = Cat.saveCatData(cat);
        let loadedCat = Cat.loadCatData(savedCat);
        console.log(savedCat);

        if(!isEqualCat(cat, loadedCat)) {
            console.log(savedCat);
            console.log(cat);
            console.log(loadedCat);
            console.log();
            numFails++;
        }
    }
    let end = Date.now();
    console.log(numFails + " fails over " + howMany + " trials");
    console.log("Took " + (end - start) + "ms");
}
//testCatSavingLoading();
