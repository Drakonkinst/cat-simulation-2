import { Logger } from "./util/logger";

const GameState = {};

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
    Logger.finer("SET " + stateName + " = " + value);
    return !existed;
}

export function get(stateName, numericOnly) {
    let path = getPath(stateName);
    let obj = GameState;
    let next = null;
    
    for(let i = 0; i < path.length; ++i) {
        next = path[i];
        if(typeof obj !== "object" || obj.hasOwnProperty(next)) {
            return numericOnly ? 0 : null;
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
    let oldValue = get(stateName, true);
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

/* Inventory */

export function addItem(name, value) {
    add("player.inventory[" + name + "]", value);
    
    // TODO: Update visuals
}

export function hasItem(name, count = 1) {
    return get("player.inventory[" + name + "]", true) >= count;
}

/* Cats */

// TODO: Cats keep a reference to their persistent data object
// So do not need to ask repeatedly from State Manager