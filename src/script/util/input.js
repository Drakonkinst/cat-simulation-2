function eventNullifier(e) {
    return $(e.target).hasClass("menu-btn");
}

function eventPassThrough() {
    return true;
}

export const InputState = {
    keyLock: false,
    navigation: true
};

export function enableSelection() {
    document.onselectstart = eventNullifier;    // IE support
    document.onmousedown = eventNullifier;      // Everything else
}

export function disableSelection() {
    document.onselectstart = eventPassThrough; // IE support
    document.onmousedown = eventPassThrough;   // Everything else
}