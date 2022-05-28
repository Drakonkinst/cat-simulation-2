import { GameInfo } from "../info.js";
import { Logger } from "./logger.js";
import { round } from "./utils.js";

/**
 * Task class that builds a reschedulable Task that can have a random interval.
 */
const MINUTES_TO_MILLISECONDS = 1000 * 60;
const FAST_TASKS_MULTIPLIER = 0.1;

export class Task {
    constructor(id, callback, minInterval, maxInterval = minInterval) {
        this.id = id;
        this.eventTimeout = null;
        this.callback = function () {
            callback();
            this.eventTimeout = null;
        }

        // interval in minutes
        this.minInterval = minInterval;
        this.maxInterval = maxInterval;
    }

    scheduleNext(scale = 1) {
        let interval = Utils.randNum(this.minInterval, this.maxInterval) * scale;

        if(GameInfo.options.fasterTasks) {
            interval *= FAST_TASKS_MULTIPLIER;
        }

        if(this.eventTimeout != null) {
            clearTimeout(this.eventTimeout);
            this.eventTimeout = null;
        }

        if(interval > 1) {
            Logger.finer("Next " + this.id + " event scheduled in " + round(interval, 2) + " minutes");
        } else {
            Logger.finer("Next " + this.id + " event scheduled in " + round(interval * 60, 0) + " seconds");
        }

        this.eventTimeout = setTimeout(this.callback, interval * MINUTES_TO_MILLISECONDS);
    }
}