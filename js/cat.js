const Cat = (() => {
    const DEFAULT_FEMALE_NAMES = ["miso", "lola", "mcgonagall", "tara", "nala", "mistie", "misty", "coco", "tasha", "raven", "valencia", "princess", "cherry", "chloe", "felicia", "olivia", "emma", "belle", "luna", "minerva", "ellie", "athena", "artemis", "poppy", "venus", "calypso", "elise", "kathy", "elizabeth", "hope"];
    const DEFAULT_MALE_NAMES = ["garfield", "orpheus", "salem", "tom", "azrael", "whiskers", "felix", "oscar", "edgar", "sox", "ollie", "leo", "snickers", "charcoal", "prince", "toby", "mikesch", "buddy", "romeo", "loki", "gavin", "momo", "illia", "theodore", "eliot", "milo", "max", "monty", "zeke" ];
    const DEFAULT_NEUTRAL_NAMES = ["lolcat", "sesame", "unagi", "avocado", "mango", "oreo", "swirly", "striped", "alpha", "beta", "gamma", "lucky", "mittens", "angel", "dakota", "ginger", "tippy", "snickers", "fish", "smokey", "muffin", "fuzzy", "nibbles", "chaser"];
    
    const BREED_INFO = {
        "american shorthair": {
            tendencies: ["quiet", "friendly", "playful", "calm"],
            coatColors: ["black", "blue", "silver", "brown", "tabby"],
            coatTextures: ["short", "dense", "hard", "lustrous"],
            eyeColors: ["blue", "copper", "green", "gold", "hazel"],
            size: "medium"
        },
        "burmese": {
            tendencies: ["playful", "friendly", "curious"],
            coatColors: ["blue", "platinum", "champagne", "sable", "lilac", "fawn", "red", "cream", "chocolate", "cinnamon"],
            coatTextures: ["short", "silky", "glossy", "satin"],
            eyeColors: ["gold", "yellow"],
            size: "medium"
        },
        "scottish fold": {
            tendencies: ["playful", "friendly"],
            coatColors: ["white", "blue", "black", "red", "cream", "silver"],
            coatTextures: ["short", "dense", "plush", "soft"],
            eyeColors: ["blue", "green", "gold", "bicolored"],
            size: "medium"
        },
        "sphinx": {
            tendencies: ["curious", "friendly", "quiet"],
            coatColors: ["white", "black", "blue", "red", "cream", "chocolate", "lavender"],
            coatTextures: ["hairless", "fine"],
            eyeColors: ["blue", "red", "green", "black", "pink", "grey"],
            size: "medium"
        }};
    const BREED_NAMES = Utils.keysAsList(BREED_INFO);
    const TRAITS = ["talkative", "quiet", "friendly", "spiteful", "playful", "lazy", "jumpy", "calm", "territorial", "curious"];
    
    const CHANCE_TRAIT = 0.70;
    
    // Creates a random name w/out checking for duplicates
    function generateCatName(isFemale) {
        let namePool = (isFemale ? DEFAULT_FEMALE_NAMES : DEFAULT_MALE_NAMES).concat(DEFAULT_NEUTRAL_NAMES);
        return Utils.chooseRandom(namePool);
    }
    
    function generateRandomTraits(breedInfo) {
        let traits = [];
        for(let trait of breedInfo.tendencies) {
            if(Utils.chance(CHANCE_TRAIT)) {
                traits.push(trait);
            }
        }
        return traits;
    }
    
    return class Cat {
        constructor(properties = {}) {
            this.isFemale = Utils.isUndefined(properties.isFemale) ? Utils.chance(0.5) : properties.isFemale;
            this.name = properties.name || generateCatName();
            this.breed = properties.breed || Utils.chooseRandom(BREED_NAMES);
            
            let breedInfo = BREED_INFO[this.breed];
            this.traits = properties.traits || generateRandomTraits(breedInfo);
            this.coatColor = properties.coatColor || Utils.chooseRandom(breedInfo.coatColors);
            this.coatTexture = properties.coatTexture || Utils.chooseRandom(breedInfo.coatTextures);
            this.eyeColor = properties.eyeColor || Utils.chooseRandom(breedInfo.eyeColors);
            
            this.hunger = properties.hunger || Utils.randInt(0, 1)
            this.thirst = properties.thirst || Utils.randInt(0, 1)
            this.morale = properties.morale || Utils.randInt(0, 1)
            this.energy = properties.energy || Utils.randInt(0, 1)
            
            this.isSleeping = Utils.isUndefined(properties.isSleeping) ? false : properties.isSleeping;
            this.consumedRecently = Utils.isUndefined(properties.consumedRecently) ? false : properties.consumedRecently;
        }
        
        static saveCatData(cat) {
            let breedInfo = BREED_INFO[cat.breed]
            let data = [
                "[", cat.name, "|",
                Utils.encodeBoolean(cat.isFemale),
                Utils.encodeArrayIndex(BREED_NAMES, cat.breed), "|",
                Utils.encodeArrayIndex(breedInfo.coatColors, cat.coatColor),
                Utils.encodeArrayIndex(breedInfo.coatTextures, cat.coatTexture),
                Utils.encodeArrayIndex(breedInfo.eyeColors, cat.eyeColor), "|",
                Utils.encodeBooleanArray(TRAITS, cat.traits), "|",
                Utils.encodeBoolean(cat.isSleeping),
                Utils.encodeBoolean(cat.consumedRecently), "|",
                Utils.roundNum(cat.hunger), "|",
                Utils.roundNum(cat.thirst), "|",
                Utils.roundNum(cat.morale), "|",
                Utils.roundNum(cat.energy), "|",
                "]"];
            return data.join("");
        }

        static loadCatData(str) {
            let properties = {};
            str = str.substring(1, str.length - 1);
            let dataArr = str.split("|");

            properties.name = dataArr[0];
            properties.isFemale = Utils.decodeBoolean(dataArr[1][0]);
            properties.breed = Utils.decodeArrayIndex(BREED_NAMES, dataArr[1].substring(1));
            
            let breedInfo = BREED_INFO[properties.breed];
            properties.coatColor = Utils.decodeArrayIndex(breedInfo.coatColors, dataArr[2][0]);
            properties.coatTexture = Utils.decodeArrayIndex(breedInfo.coatTextures, dataArr[2][1]);
            properties.eyeColor = Utils.decodeArrayIndex(breedInfo.eyeColors, dataArr[2][2]);
            properties.traits = Utils.decodeBooleanArray(TRAITS, dataArr[3]);
            properties.isSleeping = Utils.decodeBoolean(dataArr[4][0]);
            properties.consumedRecently = Utils.decodeBoolean(dataArr[4][1]);
            properties.hunger = parseFloat(dataArr[5]);
            properties.thirst = parseFloat(dataArr[6]);
            properties.morale = parseFloat(dataArr[7]);
            properties.energy = parseFloat(dataArr[8]);
            
            return new Cat(properties);
        }
        
        update() {
            
        }
    };
})();