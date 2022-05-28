/*
 * Events engine that manages and runs events.
 */

import { Button } from "./button.js";
import { disableSelection, enableSelection } from "./input.js";
import { Logger } from "./logger.js";
import { notify } from "./notifications.js";
import { Task } from "./task.js";
import { chooseWeightedArr, chooseWeightedMap } from "./utils.js";

const EVENT_INTERVAL_MIN = 3;
const EVENT_INTERVAL_MAX = 6;
const PANEL_FADE = 200;
const ERROR_MSG_FADE = 1500;
const BLINK_PERIOD = 3000;

let activeScene = null;
let activeContext = null;
let blinkInterval = null;
let task = null;
let eventPool = [];
let eventStack = [];
let GameState = null;

export function Init(gameState) {
    GameState = gameState;

    // TODO: Create event pool
    eventPool.push(
        {   //Noises Outside - gain stuff
            title: "Noises",
            isAvailable: function () {
                return true;
            },
            scenes: {
                "start": {
                    text: [
                        "knocking sounds can be heard through the door.",
                        "someone's out there."
                    ],
                    notification: "someone's knocking outside",
                    blink: true,
                    buttons: {
                        "investigate": {
                            text: "investigate",
                            nextScene: { "bread": 1, "treats": 1 }
                        },
                        "ignore": {
                            text: "do nothing",
                            nextScene: "end"
                        }
                    }
                },
                "bread": {
                    text: [
                        "a basket full of warm bread sits on the doorstep.",
                        "the streets are silent."
                    ],
                    onLoad: function () {
                        $SM.addItem("bread", 5);
                    },
                    buttons: {
                        "leave": {
                            text: "close the door",
                            nextScene: "end"
                        }
                    }
                },
                "treats": {
                    text: [
                        "a handful of cat treats sits on the doorstep, wrapped in colorful ribbons.",
                        "the streets are silent."
                    ],
                    onLoad: function () {
                        $SM.addItem("cat treat", 3);
                    },
                    buttons: {
                        "leave": {
                            text: "go back inside",
                            nextScene: "end"
                        }
                    }
                }
            }
        });

    task = new Task("random_event", randomEvent, EVENT_INTERVAL_MIN, EVENT_INTERVAL_MAX);
    task.scheduleNext();
}

function getActiveEvent() {
    if(eventStack.length > 0) {
        return eventStack[0];
    }
    return null;
}

function getEventPanel() {
    return getActiveEvent().eventPanel;
}

export function randomEvent() {
    // Can only trigger a new event if one is not currently active
    if(eventStack.length <= 0) {
        // Get list of all possible events
        let possibleEvents = [];
        for(let event of eventPool) {
            if(event.isAvailable()) {
                possibleEvents.push(event);
            }
        }

        if(possibleEvents.length > 0) {
            // Choose random event from possibilities
            let chosenEvent = chooseWeightedArr(possibleEvents);
            Logger.fine("Chose event:");
            Logger.fine(chosenEvent);
            startEvent(chosenEvent)
        } else {
            // No event found, set shorter timeout for next check
            task.scheduleNext(0.5);
            return;
        }
    }

    // Set default timeout for next random event to trigger
    task.scheduleNext();
}

function startEvent(event) {
    GameState.keyLock = true;
    GameState.navigation = false;
    eventStack.push(event);

    // Create event panel
    event.eventPanel = $("<div>")
        .addClass("event event-panel")
        .css("opacity", 0.0);
    $("<div>").addClass("event-title")
        .text(event.title)
        .appendTo(event.eventPanel);
    $("<div>").addClass("event-description")
        .appendTo(event.eventPanel);
    $("<div>").addClass("event-buttons")
        .appendTo(event.eventPanel);

    if(typeof event.getContext === "function") {
        event.context = event.getContext();
    }

    let startScene = getScene("start", event);
    if(startScene.notification != null) {
        notify(startScene.notification);
    }

    if(eventStack.length <= 1) {
        initEvent();
    }
}

function initEvent() {
    loadScene("start", true);
    let eventPanel = getEventPanel();
    $(".wrapper").append(eventPanel);
    eventPanel.animate({"opacity": 1.0}, PANEL_FADE, "linear");
    
    let currentSceneInfo = getScene(activeScene);
    if(currentSceneInfo.blink) {
        // Blink title to notify AFK players for duration of event
        blinkTitle();
    }
}

function endEvent() {
    let eventPanel = getEventPanel();
    eventPanel.animate({"opacity": 0}, PANEL_FADE, "linear", function() {
        eventPanel.remove();
        let activeEvent = getActiveEvent();
        delete activeEvent.eventPanel;
        delete activeEvent.context;
        eventStack.shift();
        
        if(eventStack.length > 0) {
            // Start next event on stack
            initEvent();
            Logger.finer(eventStack.length + " events remaining");
        } else {
            // Clear event overlay
            if(blinkInterval != null) {
                stopTitleBlink();
            }
            
            // Re-enable keyboard input
            GameState.keyLock = false;
            GameState.navigation = true;
            
            // Force refocus on body for IE
            $("body").trigger("focus");
        }
    });
}

function loadScene(name, skipNotification = false) {
    Logger.finer("Loading scene: " + name);
    activeScene = name;
    let scene = getScene(name);
    let eventPanel = getEventPanel();
    
    if(typeof scene.onLoad === "function") {
        scene.onLoad();
    }
    
    if(scene.notification != null && !skipNotification) {
        // Notify scene change
        notify(scene.notification);
    }
    
    if(scene.eventTitle != null) {
        // Set title
        $(".event-title", eventPanel).text(scene.eventTitle);
    }
    
    // Clear event panel for new scene
    $(".event-description", eventPanel).empty();
    $(".event-buttons", eventPanel).empty();
    
    // If multiple types of scenes, decide which to use here
    startStory(scene);
}

// TODO what is a story?
function startStory(scene) {
    // Set description
    let eventPanel = getEventPanel();
    let description = $(".event-description", eventPanel);
    for(let line = 0; line < scene.text.length; ++line) {
        $("<div>").text(scene.text[line]).appendTo(description);
    }
    
    if(scene.input != null) {
        // Enable selection of input box
        enableSelection();
        
        // Create input element using scene.input as placeholder prompt
        let input = $("<input>").attr({
            "type": "text",
            "name": "input",
            "spellcheck": false,
            "placeholder": scene.input
        }).appendTo(description);
        
        if(scene.maxinput != null) {
            input.attr("maxlength", scene.maxinput);
        }
        
        $("<div>").addClass("input-result")
            .css("opacity", 0.0)
            .appendTo(description);
        description.find("input")
            .trigger("focus")
            .trigger("select");
    }
    
    // Exit buttons to let player respond to the scene
    let exitButtons = $("<div>").addClass("exit-buttons")
        .appendTo($(".event-buttons", eventPanel));
    
    if(scene.buttons != null) {
        // Draw buttons
        drawButtons(scene.buttons, exitButtons);
    }
    
    $("<div>").addClass("clear").appendTo(exitButtons);
}

function drawButtons(buttons, parent) {
    for(let id in buttons) {
        if(buttons.hasOwnProperty(id)) {
            let info = buttons[id];
            let button = new Button({
                id: id,
                text: info.text,
                tooltip: info.tooltip || null,
                onClick: function() {
                    buttonClick(this);
                },
                cooldown: info.cooldown
            }).appendTo(parent);
            
            if(info.cooldown != null) {
                button.startCooldown();
            }
        }
        
        updateButtons();
    }
}

function updateButtons() {
    let buttons = getScene(activeScene).buttons;
    for(let id in buttons) {
        if(buttons.hasOwnProperty(id)) {
            let button = Button.getButton(id);
            let info = buttons[id];
            // Check if button should be disabled
            if(info.available != null && !info.available()) {
                button.setDisabled(true);
            }
        }
    }
}

function buttonClick(button) {
    // Grab button info and scene
    let scene = getScene(activeScene);
    let info = scene.buttons[button.id];
    
    // Check for scene button custom click logic
    if(info.click != null) {
        let result = info.click();
        if(result != null && !result) {
            // Result is not valid
            if(typeof result === "string") {
                // Display error message
                if(scene.input == null) {
                    // No user input, just print in notifications
                    notify(result);
                } else {
                    let resultElement = getEventPanel().find(".input-result");
                    if(resultElement.css("opacity") == 0.0) {
                        // Print as error message
                        resultElement.text(result).css("opacity", 1.0).animate({"opacity": 0.0}, ERROR_MSG_FADE, "linear");
                    }
                }
            }
            return;
        }
        
        if(scene.input != null && info.nextScene == "end") {
            disableSelection()
        }
    }
    
    updateButtons();
    if(info.notification != null) {
        // Notify button click
        notify(info.notification);
    }
    
    if(info.nextScene != null) {
        // Change scene
        if(info.nextScene == "end") {
            // End event
            button.setDisabled(true);
            endEvent();
        } else {
            // Choose next scene based on weighted probability
            let nextScene = chooseWeightedMap(info.nextScene);
            if(nextScene == null) {
                Logger.severe("No suitable scene found after \"" + activeScene + "\"");
                endEvent();
                return;
            }

            // Change scene
            loadScene(nextScene);
        }
    }
}

function blinkTitle() {
    let title = document.title;
    
    if(blinkInterval != null) {
        return;
    }
    
    blinkInterval = setInterval(() => {
       document.title = "*** EVENT ***";
       setTimeout(() => {
           document.title = title;
       }, BLINK_PERIOD / 2);
    }, BLINK_PERIOD);
}

function stopTitleBlink() {
    clearInterval(blinkInterval);
    blinkInterval = null;
}

function getScene(name, event = null) {
    event = event || getActiveEvent();
    let scene = event.scenes[name];
    // Scene defined as function take in event context
    // instead of being static
    if(typeof scene === "function") {
        return scene(event.context);
    }
    return scene;
}