const BOX_UNIT = 20;
const BORDER_SIZE = 1;
const SCALE = 0.5;

export class Display {
    constructor(parent, width = 40, height = 15) {
        this.element = $("<div>")
            .addClass("display")
            .css({
                "width": width * SCALE * BOX_UNIT - BORDER_SIZE * 2,
                "height": height * SCALE * BOX_UNIT - BORDER_SIZE * 2
            })
            .appendTo(parent);
        this.boxes = [];
    }
    
    addBox(box, update = true) {
        this.boxes.push(box);
        if(update) {
            this.drawBoxes();
        }
    }
    
    drawBoxes() {
        this.element.find(".box").remove();
        for(let box of this.boxes) {
            box.createElement().appendTo(this.element);
        }
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
                "width": this.width == 0 ? 0 : this.width * SCALE * (BOX_UNIT - 1) - (BORDER_SIZE * 2) + 1,
                "height": this.height == 0 ? 0 : this.height * SCALE * (BOX_UNIT - 1) - (BORDER_SIZE * 2) + 1,
                "bottom": this.y * SCALE * (BOX_UNIT - 1) - BORDER_SIZE,
                "left": this.x * SCALE * (BOX_UNIT - 1) - BORDER_SIZE
            });
        if(this.width == 0) {
            element.css("border-right", "none");
        }
        if(this.height == 0) {
            element.css("border-top", "none");
        }
        return element;
    }
}