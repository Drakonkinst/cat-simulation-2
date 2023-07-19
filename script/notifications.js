const Notifications = (function() {
    const MESSAGE_FADE = 500;
    const PUNCTUATION = ".!?";
    const DEFAULT_PUNCTUATION = ".";
    
    const NotifyQueue = {};
    let $notificationParent;
    
    function printMessage(message) {
        $("<div>")
            .addClass("notification")
            .css("opacity", 0)
            .text(message)
            .prependTo($notificationParent)
            .animate({ "opacity": 1 }, MESSAGE_FADE, "linear", function() {
                // remove invisible messages
                clearHidden();
            });
    };
    
    function clearHidden() {
        let bottom = $(".notify-gradient").position().top + $(".notify-gradient").outerHeight(true);
        $(".notification").each(function() {
            let $el = $(this);
            if($el.position().top > bottom) {
                $el.remove();
            }
        });
    }
    
    return {
        Init() {
            $notificationParent = $("<div>").addClass("notifications").appendTo(".wrapper");
            $("<div>").addClass("notify-gradient").appendTo($notificationParent);
        },
        
        notify(message, module, shouldQueue) {
            if(message.length > 0 && PUNCTUATION.indexOf(message.slice(-1)) < 0) {
                message += DEFAULT_PUNCTUATION;
            }
            
            if(_.isUndefined(module) || Game.activeModule == module) {
                // print message directly
                printMessage(message);
            } else {
                // add to queue
                let moduleName = module.name;
                if(shouldQueue) {
                    // creates key in NotifyQueue if it does not exist
                    if(!(moduleName in NotifyQueue)) {
                        NotifyQueue[moduleName] = [];
                    }
                    
                    NotifyQueue[moduleName].push(message);
                }
            }
        },
        
        printQueue(module) {
            let moduleName = module.name;
            if(!_.isUndefined(NotifyQueue[moduleNamee])) {
                let queue = NotifyQueue[moduleName];
                while(queue.length > 0) {
                    printMessage(queue.shift());
                }
            }
        }
    };
})();