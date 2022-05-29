import { addArea, Area, Location } from "./area.js";
import { notify } from "./util/notifications.js";

export class Room extends Location {
    constructor(id, name) {
        super(id, name);
        // TODO: Buildings and cat info
    }
}

export const House = new Area("house", "A Lonely Room");

export function Init() {
    
    House.addLocations(
        new Room("bedroom", "Bedroom").onLoad(function () {

        }),
        new Room("hallway", "Hallway")
            .onLoad(function () {

            }).onArrival(function () {
                notify("welcome to hallway.")
            }),//.setVisible(false),
    )
    addArea(House);
    
    House.Init();
}