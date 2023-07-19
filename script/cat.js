const Cat = (function() {
    return class Cat {
        constructor() {
            Logger.log("Cat go brrrr");
        }
        
        createDisplay() {
            let self = this;
            this.$displayEl = $("<span>").addClass("cat ascii").text("🐈")    // cat emoji?
                .click(function() {
                    Logger.log(self);
                });
            return this.$displayEl;
        }
        
        moveRandomly = (function(self) {
            const stepSize = 15;
            const margin = 5;
            const stepDuration = 175;
            const maxAttempts = 4;
            const moveFunctions = [
                // up
                function($el) {
                    if($el.position().top - stepSize > margin) {
                        $el.animate({"top": "-=" + stepSize}, stepDuration);
                        return true;
                    }
                    return false;
                },
                // left
                function($el) {
                    if($el.position().left - stepSize > margin) {
                        $el.animate({"left": "-=" + stepSize}, stepDuration);
                        return true;
                    }
                    return false;
                },
                // right
                function($el) {
                    if($el.position().left + stepSize < $el.parent().width() - margin) {
                        $el.animate({"left": "+=" + stepSize}, stepDuration);
                        return true;
                    }
                    return false;
                },
                // down
                function($el) {
                    if($el.position().top + stepSize < $el.parent().height() - margin) {
                        $el.animate({"top": "+=" + stepSize}, stepDuration);
                        return true;
                    }
                    return false;
                },
            ];
            return function() {
                let result;
                let attempts = 0;
                do {
                    let dir = Chance.randInt(0, 4);
                    result = moveFunctions[dir](self.$displayEl);
                    attempts++;
                } while(attempts < maxAttempts && !result);
                
            };
        })(this);
    };
})();