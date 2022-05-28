import { GameInfo } from "../info.js";
import { Logger } from "./logger.js";
import { round } from "./utils.js";

/**
 * Button class that represents a clickable button in the window.
 * Buttons can have text inside of them, a cooldown before it can be
 * clicked again, an action when it is clicked, and an action after the
 * button has cooled down.
 */

const FAST_BUTTONS_MULTIPLIER = 10.0;
const MAX_SKIP_COOLDOWN = 2;
const MILLISECONDS_TO_SECONDS = 0.001;
const SAVE_COOLDOWN_INTERVAL = 500;

const savedCooldowns = {};
const buttons = {};

function createButtonElem(button, text) {
    let elem = $("<div>")
        .addClass("button")
        .text(text)
        .on("click", () => button.click());
    // Add cooldown slider
    $("<div>").addClass("cooldown").appendTo(elem);
    return elem;
}

function doNothing() {
    
}

export class Button {
    constructor({ id = null,
                cooldown = 0,
                saveCooldown = false,
                onClick = doNothing,
                onFinish = doNothing,
                text = "button",
                tooltip = null,
                width = null } = {}) {
        this.id = id;
        this.cooldown = cooldown;
        this.onCooldown = this.cooldown > 0;
        this.saveCooldown = saveCooldown;
        this.element = createButtonElem(this, text);
        this.onClick = onClick;
        this.onFinish = onFinish;
        
        if(this.id == null && this.saveCooldown) {
            Logger.warn("Button with no ID cannot save cooldown");
        }
        
        if(tooltip != null && tooltip.exists()) {
            tooltip.appendTo(this.element);
        }
        
        if(this.id != null) {
            this.element.addClass("button_" + this.id);
        }
        
        if(width != null) {
            this.element.css("width", width)
        }
        
        if(this.id != null && savedCooldowns.hasOwnProperty(this.id)) {
            this.startCooldown(savedCooldowns[this.id]);
        }
    }
    
    static getButton(id) {
        return buttons[id];
    }
    
    static saveSavedCooldowns() {
        return JSON.stringify(savedCooldowns);
    }
    
    static loadSavedCooldowns(str) {
        savedCooldowns = JSON.parse(str);
    }
    
    setText() {
        this.element.text(text);
    }
    
    setCooldown(cooldown) {
        this.cooldown = cooldown;
    }
    
    appendTo(parent) {
        this.element.appendTo(parent);
        return this;
    }
    
    startCooldown(timeRemaining = null) {
        let cooldown = this.cooldown;
        if(GameInfo.options.instantButtons) {
            cooldown = 0;
        } else if(GameInfo.options.fasterButtons) {
            cooldown /= FAST_BUTTONS_MULTIPLIER;
        }
        
        // Calculate percentage
        let percentage = 100;
        if(timeRemaining == null) {
            timeRemaining = cooldown;
        } else {
            if(timeRemaining > cooldown) {
                timeRemaining = cooldown;
            } else {
                percentage = timeRemaining / cooldown * 100;
            }
        }
        
        if(cooldown <= MAX_SKIP_COOLDOWN) {
            // Cooldown is small enough to skip instantly
            this.finish();
            return;
        }
        
        // Make sure button is not already in the middle of a cooldown
        this.clearCooldown();
        
        // Animate button
        let self = this;
        this.element.find(".cooldown")
            .width(percentage + "%")
            .animate({ "width": "0%" }, timeRemaining, "linear", function() {
                self.clearCooldown();
                self.finish();
            });
        
        if(this.saveCooldown) {
            // Update every half second
            savedCooldowns[this.id] = timeRemaining * MILLISECONDS_TO_SECONDS;
            let interval = setInterval(function() {
                if(savedCooldowns[this.id] - SAVE_COOLDOWN_INTERVAL * MILLISECONDS_TO_SECONDS < 0) {
                    delete savedCooldowns[this.id];
                    clearInterval(interval);
                    return;
                }
                savedCooldowns[this.id] = round(savedCooldowns[this.id] - SAVE_COOLDOWN_INTERVAL * MILLISECONDS_TO_SECONDS, 2)
            }, SAVE_COOLDOWN_INTERVAL);
        }
        
        this.onCooldown = true;
        this.setDisabled(true);
    }
    
    click() {
        if(!this.element.hasClass("disabled")) {
            // Button is not disabled, run callback
            let result = this.onClick();
            // If result is null or returns true, begin the button cooldown
            if(result == null || result) {
                this.startCooldown();
            }
        }
    }
    
    finish() {
        this.onFinish();
    }
    
    clearCooldown() {
        this.onCooldown = false;
        this.setDisabled(false);
    }
    
    setDisabled(flag) {
        if(!flag && !this.onCooldown) {
            this.element.removeClass("disabled");
        } else if(flag) {
            this.element.addClass("disabled");
        }
    }
}