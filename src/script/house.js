import { addArea, Area } from "./area";
import { Button } from "./util/button";
import { Logger } from "./util/logger";
import { notify } from "./util/notifications";
import { generateRandomCat } from "./cat";
import * as $SM from "./state";
import { startIntro } from "./story";
import { setAreaDark } from "./util/input";
import { Room } from "./room";

export const House = new Area("house", "");

const cats = [];

// TODO: load cats from localstorage on Init
export function addCat(cat) {
    cats.push(cat);
    
    // Link cat data to state info
    $SM.set("house.cats[" + cat.id + "]", cat.data);
}

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
        new Button({
            text: "cat",
            onClick: function() {
                let cat = generateRandomCat();
                addCat(cat);
                Logger.info(cat);
            }
        }).appendTo(room.element);
    });

    House.addLocations(
        Bedroom,
        new Room("hallway", "Hallway").setVisible(false)
    )
    addArea(House);

    House.Init();
}