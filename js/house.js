const Room = (() => {
    return class Room extends Location {
        constructor(id, title) {
            super(id, title);
            this.buildings = {};
            this.cats = [];
        }

        setUnlocked(flag) {
            this.setVisible(flag);
            return this;
        }
    };
})();

const House = (() => {
    let self = new Area("house", "A Lonely Room");
    let catList = [];
    let roomNames = [];

    function firstEnterHallway() {
        Notifications.notify("unlocked rooms.");
        self.getRoom("living-room").setUnlocked(true);
        self.getRoom("bathroom").setUnlocked(true);
        Game.saveAll();
    }

    self.addLocations(
        new Room("bedroom", "Bedroom").onLoad(function () {

        }),
        new Room("hallway", "Hallway")
            .onLoad(function () {

            }).onArrival(function () {
                if(!self.getRoom("living-room").isVisible) {
                    firstEnterHallway();
                }
            }),//.setUnlocked(false),
        new Room("living-room", "Living Room").onLoad(function () {

        }).setUnlocked(false),
        new Room("bathroom", "Bathroom").onLoad(function () {

        }).setUnlocked(false),
        new Room("kitchen", "Kitchen").onLoad(function () {

        }).setUnlocked(false)
    );

    Utils.mergeObjects(self, {
        LaunchHouse() {
            self.Launch();
            for(let room of this.locations) {
                roomNames.push(room.id);
            }
        },

        getRoom(id) {
            return this.locations[roomNames.indexOf(id)];
        },

        saveHouseData() {
            let data = [];

            for(let i = 0; i < this.locations.length; ++i) {
                let location = this.locations[i];
                if(location.isVisible) {
                    data.push(1);
                } else {
                    data.push(0);
                }
            }

            data.push("||");

            for(let cat of catList) {
                data.push(Cat.saveCatData(cat));
            }
            return data.join("");
        },

        loadHouseData(str) {
            let dataArr = str.split("||");

            // parse unlocked locations
            let unlockedStr = dataArr[0];
            for(let i = 0; i < this.locations.length; ++i) {
                if(i < unlockedStr.length) {
                    this.locations[i].isVisible = Utils.decodeBoolean(unlockedStr[i]);
                }
            }

            // parse cats
            let catsStr = dataArr[1];
            let matchingBracket = -1;
            for(let i = 0; i < catsStr.length; ++i) {
                let char = catsStr[i];
                if(char == "[") {
                    if(matchingBracket > 0) {
                        Logger.warn("Error while parsing cat data: Expected ']' but got '['");
                    }
                    matchingBracket = i;
                }
                if(catsStr[i] == "]") {
                    if(matchingBracket < 0) {
                        Logger.warn("Error while parsing cat data: Expected '[' but got ']'");
                    } else {
                        let catStr = catsStr.substring(matchingBracket, i + 1);
                        try {
                            let cat = Cat.loadCatData(catStr);
                            catList.push(cat);
                        } catch(err) {
                            Logger.warn("Failed to parse cat data " + catStr);
                        }
                        matchingBracket = -1;
                    }
                }
            }
        },

        update() {
            for(let cat of catList) {
                cat.update();
            }
        },

        addCat(cat) {
            catList.push(cat);
        },

        getCats() {
            return catList;
        }
    });

    return self;
})();