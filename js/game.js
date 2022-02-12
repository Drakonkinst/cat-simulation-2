const Game = (() => {
    const VERSION = "2.100";
    const AREA_WIDTH = 700;
    const SLIDE_TIME_PER_ITEM = 300;
    const FOOTER_BUTTONS = [
        {
            "text": "save.",
            "click": function () {
                Logger.warn("not implemented yet!");
            }  
        },
        {
            "text": "restart.",
            "click": function() {
                Logger.warn("not implemented yet!");
            }
        },
        {
            "text": "discord.",
            "click": function() {
                window.open("https://discord.gg/Wrp7Fre"); 
            }
        },
        {
            "text": "github.",
            "class": "github",
            "click": function() {
                window.open("https://github.com/Drakonkinst/cat-simulation-2");
            }
        },
        {
            "text": "v" + VERSION,
            "class": "version"
        }
    ];
    
    let currentArea = null;
    let areas = {};
    
    function initMainDiv() {
        let mainDiv = $(".main").empty();
        $("<div>").addClass("area-select").appendTo(mainDiv);
        $("<div>").addClass("area-slider").appendTo(mainDiv);
    }

    function createFooter() {
        let footer = $("<div>").addClass("footer").appendTo("body");
        for(let i = FOOTER_BUTTONS.length - 1; i >= 0; --i) {
            let buttonInfo = FOOTER_BUTTONS[i];
            let classes = "footer-button";
            if(buttonInfo.hasOwnProperty("class")) {
                classes += " " + buttonInfo.class;
            }
            let footerButton = $("<span>").addClass("footer-button " + classes)
                .text(buttonInfo.text)
                .appendTo(footer);
            if(buttonInfo.hasOwnProperty("click")) {
                footerButton.on("click", buttonInfo.click);
            }
        }
    }
    
    function updateSliderWidth() {
        let slider = $(".area-slider");
        slider.width((slider.children().length * AREA_WIDTH) + "px");
    }
    
    return {
        /* Navigation */
        
        addArea(area) {
            area.Init().appendTo(".area-slider");
            updateSliderWidth();
            areas[area.id] = area;
        },
        
        travelTo(areaId) {
            if(currentArea == areaId) {
                return;
            }

            if(areas[areaId] == null) {
                Logger.warn("invalid area " + areaId + "!");
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
        
        /* LET'S DO THIS */
        
        Init() {
            initMainDiv();
            createFooter();
            Notifications.Init();
            
            Game.addArea(new House());
        },
        
        Launch() {
            const start = Date.now();
            
            Game.Init();
            
            const end = Date.now();
            Logger.log("initialized in " + (end - start) + "ms");
        }
    };
})();

$(function() {
    console.log(Util.chooseRandom([
        "remember: hacked cats are bad luck",
        "cheating in some kibble or just checking for bugs?",
        "thanks for stopping by!",
        "we've been expecting you, mr. anderson"
    ]));
    try {
        Game.Launch();
    } catch(err) {
        console.error("error: " + err.message);
        console.trace(err);
    }
});