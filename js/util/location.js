// creates the basic side-to-side, top-to-bottom navigation
// intention is to make this very moduler so the cat behavior can be put on top

const Location = (() => {
    const FADE_IN = 500;
    return class Location {
        constructor(id, title) {
            this.id = id;
            this.title = title;
            this.isVisible = true;
            this.elem = null;
            this.buttonElem = null;
            this.onLoadCallback = function() {};
            this.onArrivalCallback = function() {};
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
        
        setVisible(flag) {
            if(this.elem != null && this.buttonElem != null) {
                if(flag) {
                    this.buttonElem.fadeIn(FADE_IN, "linear");
                } else {
                    // no animation since this only happens upon loading
                    this.buttonElem.hide();
                }
            }
            this.isVisible = flag;
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
        
        Launch() {
            // refresh visibility now that elements are properly created
            for(let location of this.locations) {
                location.setVisible(location.isVisible);
            }
            this.goToLocationIndex(0);
        }
        
        onArrival(diff) {
            // TODO
            Notifications.printQueue(this.id);
        }
        
        setTitle(title) {
            this.title = title;
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
                Logger.warn("Tried to go to invalid location index " + index);
            }
            
            if(this.currentIndex == index) {
                return;
            }
            
            let location = this.locations[index];
            
            this.elem.find(".location-button").removeClass("selected");
            location.buttonElem.addClass("selected");
            
            let slider = this.elem.find(".location-content .location-slider");
            let locationIndex = slider.find(".location").index(location.elem);
            let currIndex = Utils.isUndefined(this.currentIndex) ? 0 : this.currentIndex;
            let diff = Math.abs(locationIndex - currIndex);
            slider.animate({ "top": -(locationIndex * LOCATION_HEIGHT) + "px" }, SLIDE_TIME_PER_ITEM * diff);
            
            location.onArrival();
            this.currentIndex = index;
        }
        
        createElement() {
            if(this.elem != null) {
                return this.elem;
            }
            
            let elem = $("<div>").addClass("area-panel area-panel_" + this.id);
            let selectMenu = $("<div>").addClass("location-select").appendTo(elem);
            let contentContainer = $("<div>").addClass("location-content").appendTo(elem);
            let slider = $("<div>").addClass("location-slider").appendTo(contentContainer);
            let self = this;
            
            for(let i = 0; i < this.locations.length; ++i) {
                let location = this.locations[i];
                location.buttonElem = $("<div>").addClass("location-button location-button_" + location.id)
                    .text(location.title)
                    .on("click", function() {
                        self.goToLocationIndex(i);
                    })
                    .appendTo(selectMenu);
                location.elem = $("<div>").addClass("location location_" + location.id)
                    .text(this.id + " " + location.id)
                    .appendTo(slider);
            }
            
            this.elem = elem;
            return elem;
        }
    };
})();