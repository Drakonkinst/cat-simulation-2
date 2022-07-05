import { Logger } from "./util/logger";
import { chooseRandom } from "./util/utils";

export const BOX_UNIT = 20;
export const BORDER_SIZE = 1;
export const BOX_SCALE = 0.5;

export class Display {
    constructor(parent, width = 40, height = 15) {
        this.element = $("<div>")
            .addClass("display")
            .css({
                "width": width * BOX_SCALE * BOX_UNIT - BORDER_SIZE * 2,
                "height": height * BOX_SCALE * BOX_UNIT - BORDER_SIZE * 2
            })
            .appendTo(parent);
        this.boxes = [];
        this.doors = [];
    }
    
    addBox(box, update = true) {
        this.boxes.push(box);
        if(update) {
            this.drawBoxes();
        }
    }
    
    addDoor(x = 0) {
        let box = new Box({ x: x, y: 0, width: 4, height: 8 });
        this.addBox(box);
        this.doors.push(box);
    }
    
    drawBoxes() {
        this.element.find(".box").remove();
        for(let box of this.boxes) {
            box.createElement().appendTo(this.element);
        }
    }
    
    collides(x, y) {
        for(let box of this.boxes) {
            if(box.solid) {
                Logger.fine("checking");
                if(box.intersects(x, y)) {
                    Logger.fine("INTERSECTS");
                    return true;
                } else {
                    Logger.fine("NO INTERSECT");
                }
            }
            
        }
        return false;
    }
    
    getRandomDoor() {
        return chooseRandom(this.doors);
    }
}

export class Box {
    constructor({
            solid = false,
            surface = false,
            height = 1,
            width = 1,
            x = 0,
            y = 0
    } = {}) {
        this.solid = solid;
        this.surface = surface;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    
    createElement() {
        let element = $("<div>")
            .addClass("box")
            .css({
                "width": this.width == 0 ? 0 : this.width * BOX_SCALE * (BOX_UNIT - 1) - (BORDER_SIZE * 2) + 1,
                "height": this.height == 0 ? 0 : this.height * BOX_SCALE * (BOX_UNIT - 1) - (BORDER_SIZE * 2) + 1,
                "bottom": this.y * BOX_SCALE * (BOX_UNIT - 1) - BORDER_SIZE,
                "left": this.x * BOX_SCALE * (BOX_UNIT - 1) - BORDER_SIZE
            });
        if(this.width == 0) {
            element.css("border-right", "none");
        }
        if(this.height == 0) {
            element.css("border-top", "none");
        }
        return element;
    }
    
    intersects(x, y) {
        Logger.fine("Checking " + x + ", " + y);
        Logger.fine(this.x + " " + this.width + "\n" + this.y + " " + this.height);
        return this.x <= x && x <= this.x + this.width
            && this.y <= y && y <= this.y + this.height;
    }
}