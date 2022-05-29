import { addArea, Area, Location } from "./area.js";
import { Button } from "./util/button.js";
import { Logger } from "./util/logger.js";
import { notify } from "./util/notifications.js";

export class Room extends Location {
    constructor(id, name) {
        super(id, name);
        // TODO: Buildings and cat info
    }
}

export const House = new Area("house", "");

export function Init() {
    const Bedroom = new Room("bedroom", "").onLoad((room) => {
        new Button({
            id: "start_game",
            text: "wake up",
            cooldown: 3000,
            onClick: () => {
                House.setName("A Lonely Room", true);
                //Bedroom.setName("Bedroom", true);
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