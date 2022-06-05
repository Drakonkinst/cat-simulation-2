import { addArea, Area, Location } from "./area.js";
import { Button } from "./util/button.js";
import { Logger } from "./util/logger.js";
import { notify } from "./util/notifications.js";
import * as $SM from "./state.js";
import { startIntro } from "./story.js";
import { setAreaDark } from "./util/input.js";

export class Room extends Location {
    constructor(id, name) {
        super(id, name);
        // TODO: Buildings and cat info
    }
}

export const House = new Area("house", "");

export function createSleepButton() {
    const sleepButton = new Button({
        id: "sleep",
        text: "sleep",
        cooldown: 60000
    });
    return sleepButton;
}

export function createLightsButton(room) {
    const lightsButton = new Button({
        id: room.id + "-lights",
        text: "lights on",
        onClick: () => {
            let key = "house.room_" + room.id + ".lights"
            let lightsOn = $SM.get(key, false);
            if(lightsOn) {
                lightsButton.setText("lights on");
                setAreaDark(true);
            } else {
                lightsButton.setText("lights off");
                setAreaDark(false);
            }
            $SM.set(key, !lightsOn);
        }
    });
    return lightsButton;
}

export function Init() {
    const Bedroom = new Room("bedroom", "Bedroom").onLoad((room) => {
        let isIntroFinished = $SM.get("progress.intro.finished", false);
        if(!isIntroFinished) {
            startIntro(House);
        }
    });

    House.addLocations(
        Bedroom,
        new Room("hallway", "Hallway").setVisible(false)
    )
    addArea(House);

    House.Init();
}