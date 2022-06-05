import { addArea, Area, Location } from "./area";
import { notify } from "./util/notifications";

export const Town = new Area("town", "A Quiet Town");

export function Init() {

    Town.addLocations(
        new Location("store", "Store").onLoad(function () {

        }),
        new Location("park", "Park")
    )
    addArea(Town);

    Town.Init();
    Town.setVisible(false);
}