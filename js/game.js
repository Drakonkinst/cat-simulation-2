const Game = (() => {
    const SAVE_KEY = "CatSimGame";
    const AREA_WIDTH = 700;
    const SLIDE_TIME_PER_ITEM = 300;

    let currentArea = null;
    let areas = {};

    function createFooter() {
        let footer = $("<div>").addClass("footer").appendTo("body");
        $("<span>").addClass("footer-button version")
            .text("v" + Game.version)
            .appendTo(footer);
        $("<span>").addClass("footer-button github")
            .text("github.")
            .on("click", function () {
                window.open("https://github.com/Drakonkinst/cat-simulation");
            }).appendTo(footer);
        $("<span>").addClass("footer-button")
            .text("discord.")
            .on("click", function () {
                window.open("https://discord.gg/Wrp7Fre");
            }).appendTo(footer);
        $("<span>").addClass("footer-button")
            .text("restart.")
            .on("click", function () {
                Game.restartGame();
            }).appendTo(footer);
        $("<span>").addClass("footer-button")
            .text("save.")
            .on("click", function () {
                //TODO: Leads to an event to manually save/export/import/load
                // but for now, just act as a quicksave
                Game.saveAll();
            }).appendTo(footer);
        $("<span>").addClass("footer-button")
            .text("stats.")
            .on("click", function () {

            }).appendTo(footer);
    }

    function updateSliderWidth() {
        let slider = $(".area-slider");
        slider.width((slider.children().length * AREA_WIDTH) + "px");
    }

    return {
        version: "2.000",
        settings: {
            debugMode: true,
            fasterTasks: false,
            instantButtons: false,
            fasterButtons: false
        },

        /* NAVIGATION */
        addArea(area) {
            let areaButton = $("<div>").addClass("area-button area-button_" + area.id)
                .text(area.title)
                .on("click", function () {
                    Logger.log(area.id);
                    Game.travelTo(area.id);
                })
                .appendTo(".area-select");
            area.buttonElem = areaButton;
            area.createElement().appendTo(".area-slider");
            areas[area.id] = area;
        },

        travelTo(areaId) {
            if(currentArea == areaId) {
                return;
            }

            if(areas[areaId] == null) {
                Logger.warn("Invalid area " + areaId + "!");
                return;
            }

            let areaObj = areas[areaId];
            $(".area-button").removeClass("selected");
            areaObj.buttonElem.addClass("selected");

            let slider = $(".area-slider");
            let panelIndex = $(".area-panel").index(areaObj.elem);
            let currentIndex = currentArea ? $(".area-panel").index(areas[currentArea].elem) : 0;
            let diff = Math.abs(panelIndex - currentIndex);
            slider.animate({ "left": -(panelIndex * AREA_WIDTH) + "px" }, SLIDE_TIME_PER_ITEM * diff);

            currentArea = areaId;
            areaObj.onArrival(diff);
        },

        /* SAVING / LOADING */
        saveAll() {
            gameStr = World.saveWorldData() + "//"
                + House.saveHouseData() + "//"
                + Button.saveSavedCooldowns() + "//"

            console.log("SAVING:", gameStr);
            localStorage.setItem(SAVE_KEY, Utils.compressData(gameStr));
            Notifications.quickNotify("saved");
        },

        loadAll() {
            if(typeof Storage == "undefined") {
                console.log("Failed to locate localStorage");
                return;
            }

            let compressed = localStorage.getItem(SAVE_KEY);
            let dataStr = Utils.decompressData(compressed);

            if(dataStr) {
                Logger.log("Loaded save!");
                let dataArr = dataStr.split("//");
                World.loadWorldData(dataArr[0]);
                House.loadHouseData(dataArr[1]);
                Button.loadSavedCooldowns(dataArr[2]);
            } else {
                Logger.log("No save found, starting a new game!");
            }
        },

        /* MENU BUTTONS */
        // manual restart (different behavior for a fail state restart)
        restartGame() {
            const RESTART_FADE_OUT = 3000;
            const RESTART_DELAY = 2000;

            if(typeof Storage == "undefined") {
                console.log("Failed to locate localStorage");
                return;
            }
            localStorage.removeItem(SAVE_KEY);
            Notifications.clearAll(RESTART_FADE_OUT);
            $(".main").stop().animate({ "opacity": 0 }, RESTART_FADE_OUT, "linear", function () {
                setTimeout(function () {
                    location.reload();
                }, RESTART_DELAY);
            });
            Notifications.notify("time to start over");
        },

        /* LET'S DO THIS */
        Launch() {
            let start = Date.now();
            Game.Init();
            Game.loadAll();
            
            World.LaunchWorld();
            House.LaunchHouse();
            Town.LaunchTown();
            
            Game.saveAll();
            
            Game.travelTo("house");
            let end = Date.now();
            Logger.log("Initialization took " + (end - start) + "ms");
        },

        Init() {
            $(".main").empty();
            $("<div>").addClass("area-select").appendTo(".main");
            $("<div>").addClass("area-slider").appendTo(".main");
            createFooter();

            Notifications.Init();

            Game.addArea(House);
            Game.addArea(Town);
            updateSliderWidth();
            
            World.Init();
        }
    };
})();

$(function () {
    console.log("> " + Utils.chooseRandom(["remember: hacked cats are bad luck", "oh, hello there!", "cheating in some kibble or just checking for bugs?", "whazzup?", "thanks for stopping by!", "we've been expecting you, mr. anderson"]));
    try {
        Game.Launch();
    } catch(err) {
        console.error("ERROR: " + err.message);
        console.trace(err);
    }
});