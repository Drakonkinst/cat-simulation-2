import { addArea, Area, Location } from "./area.js";
import { notify } from "./util/notifications.js";

export const Town = new Area("town", "A Quiet Town");

export function Init() {

    Town.addLocations(
        new Location("store", "Store").onLoad(function () {

        }),
        new Location("park", "Park")
    )
    addArea(Town);

    Town.Init();
}