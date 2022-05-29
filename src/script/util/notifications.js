import { InputState } from "./input.js";
import { Logger } from "./logger.js";

const MESSAGE_FADE_IN = 500;
const MESSAGE_FADE_OUT = 3000;

let notifyQueue = {};
let notificationsElem = null;
let gradientElem = null;
let quickNotifyElem = null;

function endsWithPunctuation(str) {
    return ".!?".indexOf(str.slice(-1)) > -1;
}

function printMessage(message) {
    $("<div>").addClass("notification")
        .css("opacity", 0)
        .text(message)
        .prependTo(notificationsElem)
        .animate({ "opacity": 1 }, MESSAGE_FADE_IN, "linear", function () {
            // Remove invisible messages
            clearHidden();
        })
}

function clearHidden() {
    let bottom = gradientElem.position().top + gradientElem.outerHeight(true);
    $(".notification").each(function () {
        let el = $(this);
        if(el.position().top > bottom) {
            el.remove();
        }
    });
}

export function Init() {
    notificationsElem = $("<div>").addClass("notifications").appendTo(".wrapper");
    gradientElem = $("<div>").addClass("notify-gradient").appendTo(notificationsElem);
    quickNotifyElem = $("<div>").addClass("quick-notify").appendTo(".wrapper");
}

export function lint(text) {
    if(text.length > 0 && !endsWithPunctuation(text)) {
        Logger.warn("Message " + text + " does not end with punctuation");
        text += ".";
    }
    return text;
}

export function notify(message = "", areaId = null, noQueue) {
    message = lint(message);

    if(areaId != null && InputState.currentArea != areaId) {
        if(!noQueue) {
            // Create key in notifyQueue if it does not exist
            if(!notifyQueue.hasOwnProperty(areaId)) {
                notifyQueue[areaId] = [];
            }
            // Add message to notifyQueue
            notifyQueue[areaId].push(message);
        }
    } else {
        // areaId is current or not specified, print message directly
        printMessage(message);
    }
}

export function printQueue(areaId) {
    if(!notifyQueue.hasOwnProperty(areaId)) {
        return;
    }

    while(notifyQueue[areaId].length) {
        Notifications.printMessage(notifyQueue[areaId].shift());
    }
}

export function quickNotify(message = "") {
    message = lint(message);
    quickNotifyElem
        .stop()
        .text(message)
        .css("opacity", 1)
        .animate({ "opacity": 0 }, MESSAGE_FADE_OUT, "linear");
}

export function clearAll(duration = MESSAGE_FADE_OUT) {
    $(".notification")
        .stop()
        .animate({ "opacity": 0 }, duration, "linear", function () {
            $(this).remove();
        });
}