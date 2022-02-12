const House = (() => {
    return class House extends Area {
        constructor() {
            super("house", "A Lonely House");
        }
        
        onInit() {
            this.addLocation(new Location("room1", "Room 1", true));
            this.addLocation(new Location("room2", "Room 2", false));
            this.addLocation(new Location("room3", "Room 3", true));
        }
    }
})();