import { Cat } from "./cat.js";
import { GameInfo } from "./info.js";
import { Button } from "./util/button.js";
import { Logger } from "./util/logger.js"

$(function() {
    Logger.setLevel(GameInfo.options.loggerLevel);
    new Button({
        text: "Hello, world!",
        cooldown: 1000,
        onClick: function() {
            Logger.info("Hello, world!");
        }
    }).appendTo($(".main"));
});