import { InputState } from "./util/input";
import { Logger } from "./util/logger";
import { printQueue } from "./util/notifications";

const LOCATION_FADE_IN = 500;
const AREA_FADE_IN = 200;
const AREA_WIDTH = 700;
const LOCATION_HEIGHT = 624;
const SLIDE_TIME_PER_ITEM = 300;

const areas = {};

export class Location {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.isVisible = true;
        this.element = null;
        this.buttonElement = null;
        this.onLoadCallback = function() {};
        this.onArrivalCallback = function() {};
    }
    
    createElement(area, selectMenu, slider) {
        this.buttonElement = $("<div>").addClass("location-button location-button_" + this.id)
            .text(this.name)
            .on("click", function () {
                area.goToLocation(i);
            })
            .appendTo(selectMenu);
        this.element = $("<div>").addClass("location location_" + this.id)
            //.text(this.id + " " + location.id)
            .appendTo(slider);
        this.onCreateElement();
    }
    
    onCreateElement() {
        // Empty
    }
    
    onLoad(callback) {
        if(callback == null) {
            // Call function
            this.onLoadCallback(this);
        } else {
            // Set function
            this.onLoadCallback = callback;
        }
        return this;
    }
    
    onArrival(callback) {
        if(callback == null) {
            // Call function
            this.onArrivalCallback(this);
        } else {
            // Set function
            this.onArrivalCallback = callback;
        }
        return this;
    }
    
    setName(name, fadeIn = false) {
        this.name = name;
        this.buttonElement.text(this.name);
        if(fadeIn) {
            this.buttonElement.hide().fadeIn(LOCATION_FADE_IN, "linear");
        }
    }
    
    setVisible(flag) {
        this.isVisible = flag;
        if(this.element == null || this.buttonElement == null) {
            return this;
        }
        if(flag) {
            this.buttonElement.fadeIn(LOCATION_FADE_IN, "linear");
        } else {
            // No animation since this only happens upon load
            this.buttonElement.hide();
        }
        return this;
    }
}

export class Area {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.locations = [];
        this.currentIndex = -1;
        this.isVisible = true;
        this.element = null;
        this.buttonElement = null;
    }
    
    Init() {
        // Set visibility now that elements are created
        for(let location of this.locations) {
            location.onLoad();
            location.setVisible(location.isVisible);
        }
        this.goToLocation(0);
    }
    
    onArrival(diff) {
        // TODO
        printQueue(this.id);
    }
    
    addLocation(location) {
        this.locations.push(location);
    }
    
    addLocations(...locationArr) {
        for(let location of locationArr) {
            this.addLocation(location);
        }
    }
    
    getLocation(index) {
        if(index < 0 || index >= this.locations.length) {
            return null;
        }
        return this.locations[index];
    }
    
    goToLocation(index) {
        if(index < 0 || index >= this.locations.length) {
            Logger.warn("Tried to go to invalid location index " + index);
            return;
        }

        if(this.currentIndex == index) {
            return;
        }

        let location = this.locations[index];

        this.element.find(".location-button").removeClass("selected");
        location.buttonElement.addClass("selected");

        let slider = this.element.find(".location-content .location-slider");
        let locationIndex = slider.find(".location").index(location.element);
        let currIndex = (this.currentIndex > -1) ? this.currentIndex : 0;
        let diff = Math.abs(locationIndex - currIndex);
        slider.animate({ "top": -(locationIndex * LOCATION_HEIGHT) + "px" }, SLIDE_TIME_PER_ITEM * diff);

        location.onArrival();
        this.currentIndex = index;
    }
    
    createElement() {
        if(this.element != null) {
            return this.element;
        }

        let elem = $("<div>").addClass("area-panel area-panel_" + this.id);
        let contentContainer = $("<div>").addClass("location-content").appendTo(elem);
        let selectMenu = $("<div>").addClass("location-select").appendTo(elem);
        let slider = $("<div>").addClass("location-slider").appendTo(contentContainer);

        for(let i = 0; i < this.locations.length; ++i) {
            this.locations[i].createElement(this, selectMenu, slider);
        }

        this.element = elem;
        return elem;
    }
    
    setName(name, fadeIn = false) {
        this.name = name;
        this.buttonElement.text(this.name);
        if(fadeIn) {
            this.buttonElement.hide().fadeIn(LOCATION_FADE_IN, "linear");
        }
    }
    
    setVisible(flag) {
        this.isVisible = flag;
        if(this.element == null || this.buttonElement == null) {
            return this;
        }
        if(flag) {
            this.buttonElement.fadeIn(AREA_FADE_IN, "linear");
            this.element.show();
        } else {
            // No animation since this only happens upon load
            this.buttonElement.hide();
            this.element.hide();
        }
        return this;
    }
}

export function Init() {
    let mainElement = $(".main");
    $("<div>").addClass("area-select").appendTo(mainElement);
    $("<div>").addClass("area-slider").appendTo(mainElement);
}

export function updateSliderWidth() {
    let slider = $(".area-slider");
    slider.width((slider.children().length * AREA_WIDTH) + "px");
}

export function addArea(area) {
    let areaButton = $("<div>").addClass("area-button area-button_" + area.id)
        .text(area.name)
        .on("click", () => {
            travelTo(area.id);
        })
        .appendTo(".area-select");
    area.buttonElement = areaButton;
    area.createElement().appendTo(".area-slider");
    areas[area.id] = area;
}

export function travelTo(areaId) {
    if(InputState.currentArea == areaId) {
        // Already here
        return;
    }
    
    Logger.finer("Traveling to area " + areaId);
    let areaObj = areas[areaId];
    if(areaObj == null) {
        Logger.severe("Invalid area " + areaId);
        return;
    }
    
    $(".area-button").removeClass("selected");
    areaObj.buttonElement.addClass("selected");
    
    let slider = $(".area-slider");
    let panelIndex = $(".area-panel").index(areaObj.element);
    let currentIndex = (InputState.currentArea == null) ? 0 : $(".area-panel").index(areas[InputState.currentArea].element);
    let diff = Math.abs(panelIndex - currentIndex);
    slider.animate({ "left": -(panelIndex * AREA_WIDTH) + "px" }, SLIDE_TIME_PER_ITEM * diff);
    
    InputState.currentArea = areaId;
    areaObj.onArrival(diff);
}