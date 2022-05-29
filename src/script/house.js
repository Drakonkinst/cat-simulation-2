import { addArea, Area, Location } from "./area.js";
import { Button } from "./util/button.js";
import { Logger } from "./util/logger.js";
import { notify } from "./util/notifications.js";
import * as $SM from "./state.js";
import { setAreaDark } from "./util/input.js";
import { randomDream, startingDreamSequence } from "./dream.js";
import { chooseRandom, randNum } from "./util/utils.js";

export class Room extends Location {
    constructor(id, name) {
        super(id, name);
        // TODO: Buildings and cat info
    }
}

export const House = new Area("house", "");

/* Start of the Game */

let startGameNudgeTimeout = null;
const startGameNudges = [
    "feather-soft whiskers brush past.",
    "purring grows more insistent."
]
function startGameNudge(nudgeMsg) {
    notify(nudgeMsg);
    startGameNudgeTimeout = setTimeout(() => {
        startGameNudge(chooseRandom(startGameNudges));
    }, randNum(10000, 20000))
}

function wakeUp() {
    House.setName("A Dark Room", true);
    setAreaDark(true);
    randomDreamButton.element.remove();
    notify("an inquisitive face peeks up above the bedsheets.");
    clearTimeout(startGameNudgeTimeout);
    startGameNudgeTimeout = null;
}

const startGameButton = new Button({
    id: "start_game",
    text: "wake up",
    cooldown: 5000,
    onClick: () => {
        let startProgress = $SM.get("progress.start");
        if(startProgress < startingDreamSequence.length) {
            notify(startingDreamSequence[startProgress]);
            if(startProgress == startingDreamSequence.length - 1) {
                setTimeout(() => {
                    notify("the embrace of far-away adventures reach out in an embrace.");
                    randomDreamButton.element.insertBefore(startGameButton.element);
                    numRemainingDreams = 5;
                }, 3000);
                setTimeout(() => {
                    startGameNudge("something purrs.");
                }, 10000);
            }
        } else {
            //startGameButton.cooldown = 2000;
        }
        // TODO: After at least 3 dreams and 2-3 second delay, cat makes noise
        // Cat keeps pestering player until they wake up but they have the option to dream some more
        // "maybe dream some more" -> does not disable both, can wake up at any time
        // if waking up while dream is on cooldown, wake up in a start
        //Bedroom.setName("Bedroom", true);
    },
    onFinish: () => {
        let startProgress = $SM.get("progress.start");
        if(startProgress < startingDreamSequence.length) {
            $SM.add("progress.start", 1);
        } else if(startProgress == startingDreamSequence.length) {
            wakeUp();
        }
    }
});

let numRemainingDreams = 0;
const randomDreamButton = new Button({
    id: "random_dream",
    text: "dream",
    cooldown: 5000,
    onClick: () => {
        randomDream();
    },
    onFinish: () => {
        if(--numRemainingDreams <= 0) {
            notify("probably better .");
            randomDreamButton.setDisabled(true);
        }
    }
});

export function Init() {
    const Bedroom = new Room("bedroom", "").onLoad((room) => {
        let startProgress = $SM.get("progress.start");
        if(startProgress < startingDreamSequence.length) {
            startGameButton.appendTo(room.element);
        }

    });

    House.addLocations(
        Bedroom,
        new Room("hallway", "Hallway").setVisible(false)
    )
    addArea(House);

    House.Init();
}