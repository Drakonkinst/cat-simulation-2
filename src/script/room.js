import { Location } from "./area";
import { Display } from "./util/display";
import { Logger } from "./util/logger";
import { Tooltip } from "./util/tooltip";

const CAT_FADE = 200;

export class Room extends Location {
    constructor(id, name) {
        super(id, name);
        this.cats = [];
        
        // TODO: Buildings info
        
        
    }
    
    onCreateElement() {
        Logger.info("CREATED");
        $("<div>").addClass("room-controls").appendTo(this.element);
        this.display = new Display(this.element);
    }

    onCatArrival(cat) {
        this.cats.push(cat);
        cat.currentRoom = id;
        
        // Create icon
        let className = "cat_" + cat.id;
        let catIcon = $("<span>")
            .addClass("cat " + className)
            .text("@")
            .on("click", () => {
                Logger.info("Clicked on " + cat.name + " (" + cat.id + ")");
        });
        let tooltip = new Tooltip("bottom right")
            .addText(cat.name)
            .appendTo(catIcon);
        catIcon.css("opacity", 0.0)
            .animate({ "opacity": 1.0 }, CAT_FADE, "linear")
            .appendTo(this.display.element);
    }

    onCatLeave(cat) {
        let index = this.cats.indexOf(cat);
        if(index < 0) {
            Logger.warn("Tried to make cat " + cat.id + " leave room " + this.id + " but it was not there");
            return;
        }
        this.cats.splice(index, 1);
        cat.currentRoom = null;
        
        // Fade out icon
        let className = "cat_" + cat.id;
        let catIcon = this.display.element.find('.' + className);
        if(catIcon.length) {
            let pseudoIcon = $("<span>")
                .addClass("cat")
                .text("@")
                .css("opacity", 1.0);
            catIcon.replaceWith(pseudoIcon.animate({ "opacity": 0.0 }, CAT_FADE, "linear", () => {
                pseudoIcon.remove();
            }));
        }
    }
}