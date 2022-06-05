import * as $SM from "./../state";

function eventNullifier(e) {
    return $(e.target).hasClass("menu-btn");
}

function eventPassThrough() {
    return true;
}

// All InputState info is not persistent
export const InputState = {
    keyLock: false,
    navigation: true,
    darkMode: false,
    darkArea: false,
    currentArea: null
};

export function enableSelection() {
    document.onselectstart = eventNullifier;    // IE support
    document.onmousedown = eventNullifier;      // Everything else
}

export function disableSelection() {
    document.onselectstart = eventPassThrough; // IE support
    document.onmousedown = eventPassThrough;   // Everything else
}

export function setDark(flag) {
    if(flag) {
        InputState.darkMode = true;
        $("body").addClass("dark");
    } else {
        InputState.darkMode = false;
        $("body").removeClass("dark");
    }
}

export function setAreaDark(isDark = null) {
    InputState.darkArea = isDark;
    if($SM.get("options.lights") == 2) {
        if(isDark) {
            setDark(true);
        } else {
            setDark(false);
        }
    }
}