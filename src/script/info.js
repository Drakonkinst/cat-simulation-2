import { LoggerLevel } from "./util/logger.js";

export const GameInfo = {
    version: "2.000",
    saveKey: "game",
    options: {
        instantButtons: false,
        fasterButtons: false,
        fasterTasks: false,
        skipIntro: false,
        loggerLevel: LoggerLevel.ALL
    }
};