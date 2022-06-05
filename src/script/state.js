import { GameInfo } from "./info";
import { Logger } from "./util/logger";
import { quickNotify } from "./util/notifications";
import LZString from "./util/lz-string";

const AUTOSAVE_INTERVAL = 60000;

let GameState = {};
let needsSave = false;

/* General State Manipulation */

// Return array of property path of input
function getPath(property) {
    let path = property.split(/[.\[\]'"]+/);
    
    // Remove empty strings
    for(let i = path.length - 1; i >= 0; --i) {
        if(path[i].length <= 0) {
            path.splice(i, 1);
        }
    }
    return path;
}

// Create state recursively
function createState(stateName, value) {
    let path = getPath(stateName);
    let obj = GameState;
    let next = null;
    let i;
    
    for(i = 0; i < path.length - 1; ++i) {
        next = path[i];
        if(!obj.hasOwnProperty(next)) {
            obj[next] = {};
        }
        obj = obj[next];
    }

    // Set final property in path to value
    next = path[i];
    let existed = obj.hasOwnProperty(next);
    obj[next] = value;
    needsSave = true;
    Logger.finer("SET " + stateName + " = " + value);
    return !existed;
}

export function startAutoSave() {
    setInterval(save, AUTOSAVE_INTERVAL);
}

export function save(force = false) {
    if(needsSave || force) {
        let data = LZString.compressToUTF16(JSON.stringify(GameState));
        localStorage.setItem(GameInfo.saveKey, data);
        needsSave = false;
        quickNotify("saved.");
        Logger.finer("Saved.");
    }
}

export function load(state) {
    GameState = state;
    save();
    Logger.finer("Loaded state.");
    Logger.finer(GameState);
}

export function loadFromLocalStorage() {
    let savedState = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem(GameInfo.saveKey)));
    load(savedState);
}

export function remove(stateName) {
    let path = getPath(stateName);
    let obj = GameState;
    let next = null;
    let i;

    for(i = 0; i < path.length - 1; ++i) {
        next = path[i];
        if(!obj.hasOwnProperty(next)) {
            return false;
        }
        obj = obj[next];
    }

    // Set final property in path to value
    next = path[i];
    let exists = obj.hasOwnProperty(next);
    if(exists) {
        delete obj[next];
        stateChanged = true;
        Logger.finer("REMOVE " + stateName);
    }
    return exists;
}

export function get(stateName, defaultValue = null) {
    let path = getPath(stateName);
    let obj = GameState;
    let next = null;
    
    for(let i = 0; i < path.length; ++i) {
        next = path[i];
        if(typeof obj === "object" && !obj.hasOwnProperty(next)) {
            return defaultValue;
        }
        obj = obj[next];
    }
    return obj;
}

// Returns true if the state did not already exist, false otherwise
export function set(stateName, value) {
    return createState(stateName, value);
}

export function add(stateName, value) {
    let oldValue = get(stateName, 0);
    if(isNaN(oldValue)) {
        Logger.severe("Tried to add to \"" + stateName + "\" which is not a number.");
        return;
    }
    set(stateName, oldValue + value);
}

// Debug function, do NOT use to manipulate state directly
export function getState() {
    return GameState;
}

// Debug function to analyze size of localStorage, in bytes
// https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
export function printSize() {
    save();
    Logger.info("Compressed Size: " + (new Blob(Object.values(localStorage.getItem(GameInfo.saveKey))).size / 1000) + "kb");
    Logger.info("Uncompressed Size: " + (new Blob([JSON.stringify(GameState)]).size / 1000) + "kb");
}

/* Inventory */

export function addItem(name, value) {
    add("player.inventory[" + name + "]", value);
    
    // TODO: Update visuals
}

export function hasItem(name, count = 1) {
    return get("player.inventory[" + name + "]", 0) >= count;
}

/* Cats */

// TODO: Cats keep a reference to their persistent data object
// So do not need to ask repeatedly from State Manager