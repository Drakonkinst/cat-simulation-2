import { randomDream } from "./dream";
import * as $SM from "./state";
import { Button } from "./util/button";
import { chooseRandom, randNum } from "./util/utils";
import { clearAll, notify } from "./util/notifications";
import { setAreaDark } from "./util/input";
import { Logger } from "./util/logger";
import { Tooltip } from "./util/tooltip";
import { createLightsButton, createSleepButton } from "./house";
import { startEvent } from "./util/events";

/**
 * Scripted events, part of the narrative
 */

// TODO
// Enter living room -> begin the weather cycle, this is the end of the intro

/* Introduction */

const INTRO_DREAMS = [
    "dreamed of white sails flying in the salty air.",
    "dreamed of stormy seas and raging tides.",
    "dreamed of a bottomless abyss, rays of light fading away."
];
const INTRO_NUDGES = [
    "something purrs softly.",
    "feather-soft whiskers brush past.",
    "purring grows more insistent.",
    "something paws gently."
];

// 0 = nothing, 1 = dream 1, 2 = dream 2, 3 = dream 3, 4 = wake up
export function startIntro(house) {
    let introStep = $SM.get("progress.intro.step", 0);
    let introRoom = house.getLocation(0);
    introRoom.setName("");
    house.setName("");
    
    if(introStep <= 3) {
        let introButton = createIntroButton(introRoom, house);
        if(introStep == 3) {
            createRandomDreamButton(introRoom, introButton);
        }
    }
    if(introStep >= 4) {
        wakeUp(introRoom, house);
    }
}

function createIntroButton(introRoom, house) {
    const introButton = new Button({
        id: "intro",
        text: "wake up",
        cooldown: 5000,
        onClick: () => {
            let introStep = $SM.get("progress.intro.step", 0);
            if(introStep < INTRO_DREAMS.length) {
                let msg = INTRO_DREAMS[introStep];
                notify(msg);
            } else {
                notify("the world beckons, and dreams start to fade.");
                clearAll();
            }
        },
        onFinish: () => {
            $SM.add("progress.intro.step", 1);
            let introStep = $SM.get("progress.intro.step");
            if(introStep == INTRO_DREAMS.length) {
                // Last intro dream
                createRandomDreamButton(introRoom, introButton);
            }
            if(introStep >= 4) {
                introButton.element.remove();
                $(".button_random-dream").remove();
                wakeUp(introRoom, house);
            }
        }
    }).appendTo(introRoom.element);
    return introButton;
}

function createRandomDreamButton(introRoom, introButton) {
    notify("dream's embrace is inviting. would be so nice to give in, just for a while longer.");
    let numRemainingDreams = 3;
    const randomDreamButton = new Button({
        id: "random-dream",
        text: "dream",
        cooldown: 5000,
        onClick: () => {
            randomDream();
        },
        onFinish: () => {
            if(--numRemainingDreams <= 0) {
                clearAll();
                notify("dreams fade away like fleeting memories.");
                randomDreamButton.setDisabled(true);
            }
        }
    });
    randomDreamButton.element.prependTo(introRoom.element);
    introNudgeTimeout = setTimeout(introNudge, 10000);
    introButton.setCooldown(8000);
    $SM.save();
    return randomDreamButton;
}

let introNudgeTimeout = null;
let nudgeIndex = 0;
function introNudge() {
    notify(INTRO_NUDGES[nudgeIndex]);
    nudgeIndex = (nudgeIndex + 1) % INTRO_NUDGES.length;
    introNudgeTimeout = setTimeout(introNudge, randNum(10000, 20000));
}

function wakeUp(introRoom, house) {
    house.setName("A Dark Room", true);
    createSleepButton().appendTo(introRoom.element)
        .setTooltip(new Tooltip().addText("slept enough for now."))
        .setDisabled(true);
    let lightButton = createLightsButton(introRoom).appendTo(introRoom.element);
    lightButton.element.one("click", () => {
        house.setName("A Lonely Room");
    });
    setAreaDark(true);
    clearAll();

    notify("the room is cold.");
    setTimeout(() => {
        spawnFirstCat();
        // Event -> "say hello"
    }, 3000);
    clearTimeout(introNudgeTimeout);
    introNudgeTimeout = null;
    $SM.save();
}

function spawnFirstCat() {
    notify("a curious face peeks up between the bedsheets.");
    startEvent({
        title: "A Curious Face",
        scenes: {
            "start": {
                text: [
                    "a strange creature looks up at you inquisitively.",
                ],
                buttons: {
                    "hello": {
                        text: "say hello",
                        click: () => {
                            notify("nothing here yet.");
                        },
                        nextScene: "end"
                    }
                }
            }
        }
    });
    // TODO: Can try to click on the cat but "can't make out anything in the dark"
    // Turn lights on -> cat runs off -> explore -> find other room
    // Lights can be turned on/off instantly, warning not to do it too much
    // Player seems like they've been here before but don't quite remember where everything is
}