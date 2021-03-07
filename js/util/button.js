const Button = (() => {
    const FASTER_BUTTONS_MULTIPLIER = 0.1;
    const MAX_SKIP_COOLDOWN = 2;
    const MILLISECONDS_TO_SECONDS = 1000;
    
    let buttons = {};
    let savedCooldowns = {};
    
    function createButtonElem(button, text) {
        let elem = $("<div>").addClass("button", "button_" + button.id)
            .text(text)
            .on("click", function() {
                let result = button.onClick();
                
                // if result does not exist or returns true, begin the button cooldown
                if(Utils.isUndefined(result) || result) {
                    button.startCooldown();
                }
            });
        $("<div>").addClass("cooldown").appendTo(elem);
        return elem;
    }
    
    return class Button {
        constructor(properties = {}) {
            this.id = properties.id || "";
            this.cooldown = properties.cooldown || 0;
            this.onCooldown = this.cooldown > 0;
            this.saveCooldown = isUndefined(properties.saveCooldown) ? false : properties.saveCooldown;
            let text = properties.text || "button";
            this.element = createButtonElem(this, text);
            this.onClick = properties.onClick || function () { };
            this.onFinish = properties.onFinish || function () { };
            
            if(properties.tooltip != null && properties.tooltip.exists()) {
                properties.tooltip.appendTo(this.element);
            }
            
            if(properties.width != null) {
                this.element.css("width", properties.width);
            }
            
            if(this.id != null) {
                buttons[this.id] = this;
            }
            
            if(savedCooldowns.hasOwnProperty(this.id)) {
                this.startCooldown(savedCooldowns[this.id]);
            }
        }
        
        // access all non-temporary buttons (not ones in events, etc.)
        static getButton(id) {
            return buttons[id];
        }
        
        static saveSavedCooldowns() {
            return JSON.stringify(savedCooldowns);
        }
        
        static loadSavedCooldowns(str) {
            savedCooldowns = JSON.parse(str);
        }
        
        setText() {
            this.element.text(text);
        }
        
        setCooldown(cooldown) {
            this.cooldown = cooldown;
        }
        
        appendTo(parent) {
            this.element.appendTo(parent);
            return this;
        }
        
        startCooldown(timeRemaining) {
            let cooldown = this.cooldown;

            if(Game.settings.instantButtons) {
                cooldown = 0;
            } else if(Game.settings.fasterButtons) {
                cooldown *= FASTER_BUTTONS_MULTIPLIER;
            }
            
            let percentage = 100;
            if(timeRemaining == null) {
                timeRemaining = cooldown;
            } else {
                if(timeRemaining > cooldown) {
                    timeRemaining = cooldown;
                } else {
                    percentage = timeRemaining / cooldown;
                }
            }

            if(cooldown <= MAX_SKIP_COOLDOWN) {
                // skip instantly
                this.onFinish();
                return;
            }
            
            // make sure the button isn't already in the middle of a cooldown
            this.clearCooldown();
            
            let self = this;
            this.element.find(".cooldown")
                .width(percentage + "%")
                .animate({ "width": "0%" }, timeRemaining * MILLISECONDS_TO_SECONDS, "linear", function() {
                    self.clearCooldown();
                    self.onFinish();
                });
            
            if(this.saveCooldown) {
                // update every half second
                savedCooldowns[this.id] = timeRemaining;
                let interval = setInterval(function() {
                    if(savedCooldowns[this.id] - 0.5 < 0) {
                        delete savedCooldowns[this.id];
                        clearInterval(interval);
                        return;
                    }
                    savedCooldowns[this.id] = Utils.round(savedCooldowns[this.id] - 0.5, 1);
                }, 500);
            }
                
            this.onCooldown = true;
            this.setDisabled(true);
        }
        
        clearCooldown() {
            this.onCooldown = false;
            this.setDisabled(false);            
        }
        
        setDisabled(flag) {
            if(!flag && !this.onCooldown) {
                this.element.removeClass("disabled");
            } else if(flag) {
                this.element.addClass("disabled");
            }
        }
    };
})();