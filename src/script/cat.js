import { setDark } from "./util/input";
import { chance, chooseRandom } from "./util/utils";

const BREEDS = {
    "american shorthair": {
        tendencies: [ "quiet", "friendly", "playful", "calm" ],
        coatColors: [ "black", "blue", "silver", "brown", "tabby" ],
        coatTextures: [ "short", "dense", "hard", "lustrous" ],
        eyeColors: [ "blue", "copper", "green", "gold", "hazel" ],
        size: "medium"
    },
    "burmese": {
        tendencies: [ "playful", "friendly", "curious" ],
        coatColors: [ "blue", "platinum", "champagne", "sable", "lilac", "fawn", "red", "cream", "chocolate", "cinnamon" ],
        coatTextures: [ "short", "silky", "glossy", "satin" ],
        eyeColors: [ "gold", "yellow" ],
        size: "medium"
    },
    "scottish fold": {
        tendencies: [ "playful", "friendly" ],
        coatColors: [ "white", "blue", "black", "red", "cream", "silver" ],
        coatTextures: [ "short", "dense", "plush", "soft" ],
        eyeColors: [ "blue", "green", "gold", "bicolored" ],
        size: "medium"
    },
    "sphinx": {
        tendencies: [ "curious", "friendly", "quiet" ],
        coatColors: [ "white", "black", "blue", "red", "cream", "chocolate", "lavender" ],
        coatTextures: [ "hairless", "fine" ],
        eyeColors: [ "blue", "red", "green", "black", "pink", "grey" ],
        size: "medium"
    }
}
const BREED_NAMES = Object.keys(BREEDS);

const FEMALE_NAMES = [
    "miso", "lola", "mcgonagall", "tara",
    "nala", "mistie", "misty", "coco",
    "tasha", "raven", "valencia", "princess",
    "cherry", "chloe", "felicia", "olivia",
    "emma", "belle", "luna", "minerva",
    "ellie", "athena", "artemis", "poppy",
    "venus", "calypso", "elise", "kathy",
    "elizabeth", "hope"
];
const MALE_NAMES = [
    "garfield", "orpheus", "salem", "tom",
    "azrael", "whiskers", "felix", "oscar",
    "edgar", "sox", "ollie", "leo",
    "snickers", "charcoal", "prince", "toby",
    "mikesch", "buddy", "romeo", "loki",
    "gavin", "momo", "illia", "theodore",
    "eliot", "milo", "max", "monty",
    "zeke"
];
const NEUTRAL_NAMES = [
    "lolcat", "sesame", "unagi", "avocado",
    "mango", "oreo", "swirly", "striped",
    "lucky", "mittens", "angel", "dakota",
    "ginger", "tippy", "snickers", "fish",
    "smokey", "muffin", "fuzzy", "nibbles",
    "chaser", "pouncer", "buttercup"
];

const NEEDS = [ "food", "water", "litterbox", "play", "affection", "nap" ];

function getNeedIndex(name) {
    let index = NEEDS.indexOf(name);
    if(index < 0) {
        throw "Unknown need \"" + name + "\"";
    }
    return index;
}

// Have parameters for names etc.
export function generateRandomCat({
        name = null,
        isFemale = chance(0.5)} = {}) {
    if(name == null) {
        let namePool = (isFemale ? FEMALE_NAMES : MALE_NAMES).concat(NEUTRAL_NAMES);
        name = chooseRandom(namePool);
    }
    return new Cat(name, isFemale);
}

export class Cat {
    constructor(name, isFemale, breed,
                coatColor, coatTexture, eyeColor,
                traits = [],
                food, water, litterbox, play, affection, nap,
                happiness, trust) {
        
        // Data that needs to be saved once or rarely
        this.info = {
            name,
            isFemale,
            breed,
            coatColor,
            coatTexture,
            eyeColor,
            traits
        };
        
        // Data that can be updated often
        this.data = {
            needs: [food, water, litterbox, play, affection, nap],
            happiness,
            trust
        };
        
        // Convert to Set for easier access
        this.traits = new Set(traits);
        
        // Remember rooms
        this.lastFoodBowl = null;
        this.lastWaterBowl = null;
        this.lastLitterbox = null;
        this.lastNapSpot = null;
    }
    
    getHighestNeed() {
        let highestNeed = null;
        let highestNeedValue = -999;
        for(let i = 0; i < NEEDS.length; ++i) {
            let value = this.data.needs[i];
            if(value > highestNeedValue) {
                highestNeedValue = value;
                highestNeed = NEEDS[i];
            }
        }
        return highestNeed;
    }
    
    setNeed(name, value) {
        let index = getNeedIndex(name);
        this.data.needs[index] = value;
        return value;
    }

    addNeed(name, value) {
        let index = getNeedIndex(name);
        let newValue = this.needs[index] + value;
        this.data.needs[index] = newValue;
        return newValue;
    }
    
    getNeed(name) {
        let index = getNeedIndex(name);
        return this.data.needs[index];
    }
    
    
}