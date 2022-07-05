import { addArea, Area } from "./area";
import { Button } from "./util/button";
import { Logger } from "./util/logger";
import { notify } from "./util/notifications";
import { generateRandomCat } from "./cat";
import * as $SM from "./state";
import { startIntro } from "./story";
import { setAreaDark } from "./util/input";
import { Room } from "./room";
import { Box } from "./util/display";

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
        
        // Bed
        room.display.addBox(new Box({x: 0, y: 0, width: 10, height: 3}));
        room.display.addBox(new Box({x: 0, y: 0, width: 3, height: 3}));
        
        // Chair
        room.display.addBox(new Box({x: 32, y: 0, width: 0, height: 4}));
        room.display.addBox(new Box({x: 32, y: 0, width: 2, height: 2}));
        
        // Table
        room.display.addBox(new Box({x: 36, y: 2, width: 5, height: 1}));
        room.display.addBox(new Box({x: 36, y: 0, width: 0, height: 2}));
        room.display.addBox(new Box({x: 41, y: 0, width: 0, height: 2}));
        
        // Door
        room.display.addBox(new Box({x: 20, y: 0, width: 4, height: 8}));
        /*
        room.display.addBox(new Box({x: 0, y: 0}));
        room.display.addBox(new Box({x: 1, y: 0}));
        room.display.addBox(new Box({x: 2, y: 0}));
        room.display.addBox(new Box({x: 3, y: 0}));
        room.display.addBox(new Box({x: 4, y: 0}));
        room.display.addBox(new Box({x: 0, y: 1, width: 3}));
        */
    });

    House.addLocations(
        Bedroom,
        new Room("hallway", "Hallway").setVisible(false)
    );
    addArea(House);

    House.Init();
}