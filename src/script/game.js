import { Cat } from "./cat.js";
import { GameInfo } from "./info.js";
import { Button } from "./util/button.js";
import { Logger } from "./util/logger.js"
import { Notifications } from "./util/notifications.js";

const GameState = {
    
};

$(function() {
    Logger.setLevel(GameInfo.options.loggerLevel);
    Notifications.Init(GameState);
    
    new Button({
        text: "Hello, world!",
        cooldown: 1000,
        onClick: function() {
            Logger.info("Hello, world!");
            Notifications.notify("Hello, world!");
            Notifications.quickNotify("Hello, world!");
        }
    }).appendTo($(".main"));
});