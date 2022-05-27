import { Cat } from "./cat.js";
import { Logger, LoggerLevel } from "./util/logger.js"

export const GameInfo = {
    version: "alpha 2.000",
    options: {
        loggerLevel: LoggerLevel.ALL
    }
};

$(function() {
    Logger.setLevel(GameInfo.options.loggerLevel);
    Logger.info("Hello, world!");
});