import { BOX_SCALE, BOX_UNIT } from "./display";
import { setDark } from "./util/input";
import { Logger } from "./util/logger";
import { chance, chooseRandom, generateUID, randInt } from "./util/utils";

const CAT_ICON = '@';
const CAT_ICON_SMALL = 'α';
const ICON_OFFSET_Y = -3;
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

const TRAITS = [
    "lazy",
    "playful",
    "loud",
    "quiet",
    "friendly",
    "jumpy",
    "calm",
    "antisocial",
    "curious",
    "active",
    "chaotic",
    "purring",
    "affectionate",
    "intelligent",
    "shy",
    "suspicious",
    "gentle",
    "aggressive",
    "vigilant",
    "hunter",
    "social",
    "dominant"
];
const CHANCE_TENDENCY = 0.7;
const CHANCE_RARE = 0.02;
const MAX_TRAITS = 5;
const NEEDS = [ "food", "water", "litterbox", "play", "affection", "nap" ];
const WEIGHTS = [ "thin", "underweight", "average", "overweight", "obese" ];
const WEIGHT_INTERVAL = 100;

function getNeedIndex(name) {
    let index = NEEDS.indexOf(name);
    if(index < 0) {
        throw "Unknown need \"" + name + "\"";
    }
    return index;
}

function generateTraits(tendencies) {
    let traits = [];
    for(let i = 0; i < TRAITS.length; ++i) {
        let traitName = TRAITS[i];
        if(tendencies.includes(traitName)) {
            if(chance(CHANCE_TENDENCY)) {
                traits.push(i);
            }
        } else if(chance(CHANCE_RARE)) {
            traits.push(i);
        }
    }
    while(traits.length > MAX_TRAITS) {
        let randomIndex = randInt(0, traits.length);
        traits.splice(randomIndex, 1);
    }
    return traits;
}

function traitsArrToSet(traitsArr) {
    let set = new Set();
    for(let traitIndex of traitsArr) {
        set.add(TRAITS[traitIndex]);
    }
    return set;
}

// Have parameters for names etc.
// TODO: Validate ID and name to make sure it does not conflict w/any other cats in the house
export function generateRandomCat({
        name = null,
        generateName = true,
        isFemale = chance(0.5),
        breed = chooseRandom(BREED_NAMES),
        happiness = randInt(0, 101),
        trust = randInt(0, 21),
        weightClass = 2} = {}) {
    let id = generateUID();
    // Generate name
    if(name == null && generateName) {
        let namePool = (isFemale ? FEMALE_NAMES : MALE_NAMES).concat(NEUTRAL_NAMES);
        name = chooseRandom(namePool);
    }
    
    // Generate breed info
    let breedInfo = BREEDS[breed];
    let coatColor = chooseRandom(breedInfo.coatColors);
    let coatTexture = chooseRandom(breedInfo.coatTextures);
    let eyeColor = chooseRandom(breedInfo.coatTextures);
    
    // Generate traits
    let traits = generateTraits(breedInfo.tendencies);
    
    // Other attributes
    let weight = weightClass * WEIGHT_INTERVAL + randInt(0, WEIGHT_INTERVAL);
    
    return new Cat(id, name, isFemale, breed,
                coatColor, coatTexture, eyeColor,
                traits,
                0, 0, 0, 0, 0, 0,
                happiness, trust, weight);
}

export class Cat {
    constructor(id, name, isFemale, breed,
                coatColor, coatTexture, eyeColor,
                traits = [],
                food, water, litterbox, play, affection, nap,
                happiness, trust, weight) {
        
        this.id = id;
        
        // Cat data
        this.data = {
            // Updated rarely
            name,
            isFemale,
            breed,
            coatColor,
            coatTexture,
            eyeColor,
            traits,
            
            // Updated often
            needs: [food, water, litterbox, play, affection, nap],
            happiness,
            trust,
            weight
        };
        
        // Convert to Set for easier access
        this.traits = traitsArrToSet(this.data.traits);
        
        // Remember rooms
        this.lastFoodBowl = null;
        this.lastWaterBowl = null;
        this.lastLitterbox = null;
        this.lastNapSpot = null;
        this.currentRoom = null;
        
        // Display icon
        this.element = null;
        
        // States
        this.isSleeping = null;
        this.currentNeed = null;
        this.x = 0;
        this.y = 0;
        
        // Weight should not be pounds/metric, but rather a tier
        // thin, underweight, average, overweight, obese
    }
    
    // Objective AI
    
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
    
    // Tasks
    
    // Movement (Low level operations)
    
    move(x, y) {
        if(this.icon == null) {
            return;
        }
        
        this.x = x;
        this.y = y;
        this.icon.css({
            "left": x * BOX_UNIT * BOX_SCALE,
            "bottom": y * BOX_UNIT * BOX_SCALE + ICON_OFFSET_Y
        });
        if(this.currentRoom.display.collides(x, y)) {
            Logger.warn("Cat collided with something!");
        }
        
        // Text is always first element
        if(this.currentRoom.display.collides(x, y + 1)) {
            this.setIconText(CAT_ICON_SMALL);
        } else {
            this.setIconText(CAT_ICON);
        }
    }
    
    setIconText(text) {
        this.icon[0].childNodes[0].nodeValue = text;
    }
    
    
}