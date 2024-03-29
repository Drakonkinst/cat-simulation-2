import { Cat } from "./cat";
import { GameInfo } from "./info";
import { Button } from "./util/button";
import { Init as InitEvents, randomEvent, setCurrentEventTitle, startEvent } from "./util/events";
import { Logger } from "./util/logger.js"
import { Init as InitNotifications, notify, quickNotify } from "./util/notifications";
import { House, Init as InitHouse } from "./house.js"
import { Init as InitTown } from "./town.js"
import { Init as InitAreaContainer, travelTo, updateSliderWidth } from "./area.js"
import { Tooltip } from "./util/tooltip";
import * as $SM from "./state";
import { InputState, setAreaDark, setDark } from "./util/input";

function InitState() {

    if(localStorage.hasOwnProperty(GameInfo.saveKey)) {
        $SM.loadFromLocalStorage();
    } else {
        $SM.set("world.day", 1);
        $SM.set("options.lights", 0);
        $SM.set("progress.unlocked.town", false);
    }
}

function InitAreas() {
    InitAreaContainer();
    InitHouse();
    InitTown();

    // TODO Make sure to call this whenever a new area is added
    // which might be just here tbh
    updateSliderWidth();
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
        id: "options",
        getContext: () => {
            let lightMode = $SM.get("options.lights", 0);
            return lightMode;
        },
        scenes: {
            "start": (lightMode) => {
                return {
                    text: [
                        "set to heart's desire."
                    ],
                    onLoad: () => {
                        setCurrentEventTitle("Options");
                    },
                    buttons: {
                        "lights": {
                            text: getLightModeName(lightMode),
                            click: function () {
                                let currentLightMode = $SM.get("options.lights", 0);
                                currentLightMode = (currentLightMode + 1) % 3;
                                setLightMode(currentLightMode);
                                $(".button.button_lights").text(getLightModeName(currentLightMode));
                            }
                        },
                        "save": {
                            nextScene: "export_import",
                            click: () => {
                                $SM.save();
                            }
                        },
                        "restart": {
                            nextScene: "confirm_restart"
                        },
                        "close": {
                            nextScene: "end"
                        }
                    }
                };
            },
            "confirm_restart": {
                text: [
                    "restart the game?"
                ],
                onLoad: () => {
                    setCurrentEventTitle("Restart?");
                },
                buttons: {
                    "yes": {
                        click: function () {
                            restart();
                        },
                        nextScene: "end"
                    },
                    "no": {
                        nextScene: "start"
                    }
                }
            },
            "export_import": {
                text: [
                    "export or import save data",
                    "for backing up or migrating computers"
                ],
                onLoad: () => {
                    setCurrentEventTitle("Export / Import");
                },
                buttons: {
                    "export": {
                        click: function () {
                            notify("nothing here yet.");
                        }
                    },
                    "import": {
                        click: function () {
                            notify("nothing here yet.");
                        }
                    },
                    "cancel": {
                        nextScene: "start"
                    }
                }
            }
        }
    }, true);
}

function getLightModeName(index) {
    let text = "lights: ";
    if(index == 0) {
        text += "on";
    } else if(index == 1) {
        text += "off";
    } else if(index == 2) {
        text += "adaptive";
    }
    return text;
}

function setLightMode(index) {
    $SM.set("options.lights", index);
    if(index == 0) {
        setDark(false);
    } else if(index == 1) {
        setDark(true);
    } else if(index == 2) {
        setAreaDark(InputState.darkArea);
    }
}

function restart() {
    // TODO: Put a fancy fade-out here later
    localStorage.removeItem(GameInfo.saveKey);
    location.reload();
}

function Init() {
    Logger.setLevel(GameInfo.options.loggerLevel);

    InitFooter();
    InitNotifications();

    InitState();
    InitEvents();
    InitAreas();

    // TODO: Equipment visualization (based on room)
    // TODO: House stuff
    // TODO: Slow unlock of rooms/locations
    // TODO: World + weather
    // TODO: Saving? What parts should be saved?
    $SM.startAutoSave();

    // Debug function
    window.$SM = $SM;
}

function Launch() {
    Init();

    travelTo("house");

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
    });//.appendTo($(".location.location_bedroom"));
}

function getState() {
    return $SM.getState();
}

$(function () {
    // Let's do this!
    //try {
    Launch();
    //} catch(err) {
    //Logger.severe("Error: " + err.message);
    //console.trace(err);
    //}
});