const Room = (function() {
    return class Room {
        constructor(options) {
            Logger.log("Making room!");
            this.$el = $("<div>").addClass("room-display").appendTo(".content");
        }
        
        addCat(cat) {
            let $catEl = cat.createDisplay().appendTo(this.$el);
            setInterval(cat.moveRandomly, 750);
        }
    }
})();