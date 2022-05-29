import { Cat } from "./cat.js";
import { GameInfo } from "./info.js";
import { Button } from "./util/button.js";
import { Init as InitEvents, randomEvent, startEvent } from "./util/events.js";
import { Logger } from "./util/logger.js"
import { Init as InitNotifications, notify, quickNotify } from "./util/notifications.js";
import { Tooltip } from "./util/tooltip.js";
import * as $SM from "./state.js";
import { setDark } from "./util/input.js";

function InitState() {
    $SM.set("world.day", 1);
    $SM.set("options.lights", 0);
}

function InitAreas() {
    let mainElement = $(".main").empty();
    $("<div>").addClass("area-select").appendTo(mainElement);
    $("<div>").addClass("area-slider").appendTo(mainElement);
}

function InitFooter() {
    const GITHUB_URL = "https://github.com/Drakonkinst/cat-simulation-2";
    const DISCORD_URL = "https://discord.gg/Wrp7Fre";

    let footer = $("<div>").addClass("footer").appendTo("body");
    $("<span>").addClass("footer-button version")
        .text("v" + GameInfo.version)
        .appendTo(footer);
    $("<span>").addClass("footer-button github")
        .text("github.")
        .on("click", () => {
            window.open(GITHUB_URL);
        }).appendTo(footer);
    $("<span>").addClass("footer-button")
        .text("discord.")
        .on("click", () => {
            window.open(DISCORD_URL);
        }).appendTo(footer);
    $("<span>").addClass("footer-button")
        .text("options.")
        .on("click", () => {
            showOptions();
        }).appendTo(footer);
}

// Save, restart, lights off
function showOptions() {
    startEvent({
        title: "Options",
        scenes: {
            "start": function() {
                let lightMode = $SM.get("options.lights");
                return {
                    text: [
                        "set to heart's desire."
                    ],
                    buttons: {
                        "lights": {
                            text: getLightModeName(lightMode),
                            click: function() {
                                lightMode = (lightMode + 1) % 3;
                                setLightMode(lightMode);
                                $(".button.button_lights").text(getLightModeName(lightMode));
                            }
                        },
                        "save": {
                            click: function() {
                                notify("nothing here yet.");
                            }
                        },
                        "restart": {
                            nextScene: "confirm_restart"
                        },
                        "load": {
                            click: function () {
                                notify("nothing here yet.");
                            }
                        },
                        "close": {
                            nextScene: "end"
                        }
                    }
                }
            },
            "confirm_restart": {
                text: [
                    "restart the game?"
                ],
                buttons: {
                    "yes": {
                        click: function() {
                            notify("nothing here yet.");
                        },
                        nextScene: "end"
                    },
                    "no": {
                        nextScene: "start"
                    }
                }
            }
        }
    })
}

function getLightModeName(index) {
    if(index == 0) {
        return "always light";
    } else if(index == 1) {
        return "always dark";
    } else if(index == 2) {
        return "adaptive";
    }
}

function setLightMode(index) {
    $SM.set("options.lights", index);
    if(index == 0) {
        setDark(false);
    } else if(index == 1) {
        setDark(true);
    } else if(index == 2) {
        // TODO: (Later) adaptive lighting
        setDark(false);
    }
}

function Init() {
    Logger.setLevel(GameInfo.options.loggerLevel);
    
    InitState();
    InitAreas();
    InitFooter();
    InitNotifications();
    InitEvents();
    
    // TODO: Tab navigation and rooms
    // TODO: Equipment visualization
    // TODO: Saving? What parts should be saved?
    
    // Debug function
    window.getState = getState;
}

function Launch() {
    Init();
    
    // Test button
    new Button({
        text: "Hello, world!",
        tooltip: new Tooltip().addCost("soul", 1).addText("something's out there."),
        cooldown: 1000,
        onClick: function () {
            Logger.info("Hello, world!");
            notify("Hello, world!");
            quickNotify("Hello, world!");
            randomEvent();
        }
    }).appendTo($(".main"));
}

function getState() {
    return $SM.getState();
}

$(function() {
    // Let's do this!
    try {
        Launch();
    } catch(err) {
        Logger.severe("Error: " + err.message);
        console.trace(err);
    }
});