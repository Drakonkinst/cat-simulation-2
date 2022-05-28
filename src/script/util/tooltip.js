
/**
 * Tooltip class that represents a tooltip shown when hovering over an element.
 * Tooltips can be oriented relative to the element.
 */

export class Tooltip {
    // Position can be any combination of [ "top", "bottom" ] and [ "left", "right" ]
    constructor(position = "bottom left") {
        this.element = $("<div>")
            .addClass("tooltip " + position);
    }
    
    addText(text) {
        $("<div>").text(text).appendTo(this.element);
        return this;
    }
    
    addCost(item, quantity) {
        $("<div>").addClass("row_key").text(item).appendTo(this.element);
        $("<div>").addClass("row_val").text(quantity).appendTo(this.element);
        return this;
    }
    
    append(element) {
        this.element.append(element);
        return this;
    }
    
    appendTo(element) {
        this.element.appendTo(element);
        return this;
    }
    
    exists() {
        return this.element.children().length > 0;
    }
}