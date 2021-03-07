const Town = (() => {
    let self = new Area("town", "A Quiet Town");

    self.addLocations(
        new Location("bedroom", "Bedroom").onLoad(function () {

        }),
        new Location("hallway", "Hallway").onLoad(function () {

        }),//.setUnlocked(false),
        new Location("living-room", "Living Room").onLoad(function () {

        }),//.setUnlocked(false),
        new Location("bathroom", "Bathroom").onLoad(function () {

        }),//.setUnlocked(false),
        new Location("kitchen", "Kitchen").onLoad(function () {

        })
    );
    
    Utils.mergeObjects(self, {
        LaunchTown() {
            self.Launch();
        }
    })

    return self;
})();