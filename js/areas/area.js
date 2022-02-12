const Location = (() => {
    const FADE_IN = 500;
    return class Location {
        constructor(id, title, isUnlocked = false) {
            this.id = id;
            this.title = title;
            this.isUnlocked = isUnlocked;
            this.elem = null;
            this.buttonElem = null;
            this.onLoadCallback = function () {};
            this.onArrivalCallback = function () {};
        }

        onLoad(callback) {
            if(callback == null) {
                // call function instead
                this.onLoadCallback(this);
                return this;
            }
            this.onLoadCallback = callback;
            return this;
        }

        onArrival(callback) {
            if(callback == null) {
                // call function instead
                this.onArrivalCallback(this);
                return this;
            }
            this.onArrivalCallback = callback;
            return this;
        }

        setUnlocked(flag) {
            if(this.elem != null && this.buttonElem != null) {
                if(flag) {
                    this.buttonElem.fadeIn(FADE_IN, "linear");
                    this.elem.fadeIn(FADE_IN, "linear");
                    this.elem.addClass("unlocked");
                } else {
                    this.buttonElem.hide();
                    this.elem.css("opacity", 0.0);
                    this.elem.removeClass("unlocked");
                }
            }
            this.isUnlocked = flag;
        }
    }
})();

const Area = (() => {
    const FADE_IN = 200;
    const LOCATION_HEIGHT = 624;
    const SLIDE_TIME_PER_ITEM = 300;

    return class Area {
        constructor(id, title = "") {
            this.id = id;
            this.title = title;
            this.locations = [];
            this.currentIndex = -1;
            this.isHidden = false;
            this.elem = null;
            this.buttonElem = null;
        }
        
        Init() {
            this.onInit();
            this.createButton();
            this.createElement();
            
            for(let location of this.locations) {
                location.setUnlocked(location.isUnlocked);
            }
            this.goToLocationIndex(0);
            
            return this.elem;
        }

        onInit() {
            // Should be overridden
        }

        onArrival(diff) {
            Notifications.printQueue(this.id);
        }

        setTitle(title) {
            this.title = title;
            this.buttonElem.text(title);
        }

        addLocation(location) {
            this.locations.push(location);
        }

        addLocations(...locationArr) {
            for(let location of locationArr) {
                this.addLocation(location);
            }
        }

        goToLocationIndex(index) {
            if(index < 0 || index >= this.locations.length) {
                Logger.warn("tried to go to invalid location index " + index);
            }

            if(this.currentIndex == index) {
                return;
            }

            let location = this.locations[index];

            this.elem.find(".location-button").removeClass("selected");
            location.buttonElem.addClass("selected");

            let slider = this.elem.find(".location-content .location-slider");
            let locationIndex = slider.find(".location").index(location.elem);
            let currIndex = (this.currentIndex == null) ? 0 : this.currentIndex;
            let diff = Math.abs(locationIndex - currIndex);
            slider.animate({ "top": -(locationIndex * LOCATION_HEIGHT) + "px" }, SLIDE_TIME_PER_ITEM * diff);

            location.onArrival();
            this.currentIndex = index;
        }

        createElement() {
            if(this.elem != null) {
                return this.elem;
            }

            this.elem = $("<div>").addClass("area-panel area-panel_" + this.id);
            let selectMenu = $("<div>").addClass("location-select").appendTo(this.elem);
            let contentContainer = $("<div>").addClass("location-content").appendTo(this.elem);
            let slider = $("<div>").addClass("location-slider").appendTo(contentContainer);
            let self = this;

            for(let i = 0; i < this.locations.length; ++i) {
                let location = this.locations[i];
                location.buttonElem = $("<div>").addClass("location-button location-button_" + location.id)
                    .text(location.title)
                    .on("click", function () {
                        self.goToLocationIndex(i);
                    })
                    .appendTo(selectMenu);
                location.elem = $("<div>").addClass("location location_" + location.id)
                    .text(this.id + " " + location.id)
                    .appendTo(slider);
            }
        }
        
        createButton() {
            this.buttonElem = $("<div>").addClass("area-button area-button_" + this.id)
                .text(this.title)
                .on("click", function () {
                    Game.travelTo(this.id);
                })
                .hide().fadeIn(FADE_IN, "linear")
                .appendTo(".area-select");
        }
    };
})();