import { Location } from "./area";
import { Display } from "./display";
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

    onCatArrival(cat, x = 0, y = 0) {
        this.cats.push(cat);
        cat.currentRoom = this;
        
        // Create icon
        let className = "cat_" + cat.id;
        cat.icon = $("<span>")
            .addClass("cat " + className)
            .on("click", () => {
                Logger.info("Clicked on " + cat.data.name + " (" + cat.id + ")");
        });
        let tooltip = new Tooltip("top left")
            .addText(cat.data.name)
            .appendTo(cat.icon);
        cat.icon.css("opacity", 0.0)
            .animate({ "opacity": 1.0 }, CAT_FADE, "linear")
            .appendTo(this.display.element);
        cat.move(x, y);
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
        if(cat.icon != null) {
            let pseudoIcon = $("<span>")
                .addClass("cat")
                .text("@")
                .css("opacity", 1.0);
            cat.icon.replaceWith(pseudoIcon.animate({ "opacity": 0.0 }, CAT_FADE, "linear", () => {
                pseudoIcon.remove();
            }));
            cat.icon = null;
        }
    }
}