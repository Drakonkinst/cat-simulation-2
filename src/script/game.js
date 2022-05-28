import { Cat } from "./cat.js";
import { GameInfo } from "./info.js";
import { Button } from "./util/button.js";
import { Init as InitEvents, randomEvent } from "./util/events.js";
import { Logger } from "./util/logger.js"
import { Init as InitNotifications, notify, quickNotify } from "./util/notifications.js";
import { Tooltip } from "./util/tooltip.js";

$(function() {
    Logger.setLevel(GameInfo.options.loggerLevel);
    InitNotifications();
    InitEvents();
    
    // TODO: improve CSS + add dark mode
    // TODO: Tab navigation and rooms
    // TODO: Equipment and state manager
    // TODO: Saving?
    // TODO: Footer
    new Button({
        text: "Hello, world!",
        tooltip: new Tooltip().addCost("soul", 1).addText("something's out there."),
        cooldown: 1000,
        onClick: function() {
            Logger.info("Hello, world!");
            notify("Hello, world!");
            quickNotify("Hello, world!");
            randomEvent();
        }
    }).appendTo($(".main"));
});