import { Cat } from "./cat.js";
import { GameInfo } from "./info.js";
import { Button } from "./util/button.js";
import { Init as InitEvents, randomEvent } from "./util/events.js";
import { Logger } from "./util/logger.js"
import { Init as InitNotifications, notify, quickNotify } from "./util/notifications.js";

const GameState = {
    keyLock: false,
    navigation: true
};

$(function() {
    Logger.setLevel(GameInfo.options.loggerLevel);
    InitNotifications(GameState);
    InitEvents(GameState);
    
    new Button({
        text: "Hello, world!",
        cooldown: 1000,
        onClick: function() {
            Logger.info("Hello, world!");
            notify("Hello, world!");
            quickNotify("Hello, world!");
            randomEvent();
        }
    }).appendTo($(".main"));
});