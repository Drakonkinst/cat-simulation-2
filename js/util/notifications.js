const Notifications = (() => {
    // time in milliseconds for a notification to turn completely visible
    const MESSAGE_FADE_IN = 500;
    const MESSAGE_FADE_OUT = 3000;

    let notifyQueue = {};
    let notificationsElem = null;
    let gradientElem = null;
    let quickNotifyElem = null;

    function endsWithPunctuation(str) {
        return ".!?".indexOf(str.slice(-1)) > -1;
    }

    function printMessage(message) {
        $("<div>").addClass("notification")
            .css("opacity", 0)
            .text(message)
            .prependTo(notificationsElem)
            .animate({ "opacity": 1 }, MESSAGE_FADE_IN, "linear", function () {
                // remove invisible messages
                clearHidden();
            })
    }

    function clearHidden() {
        let bottom = gradientElem.position().top + gradientElem.outerHeight(true);
        $(".notification").each(function () {
            let el = $(this);
            if(el.position().top > bottom) {
                el.remove();
            }
        });
    }

    return {
        Init() {
            notificationsElem = $("<div>").addClass("notifications").appendTo(".wrapper");
            gradientElem = $("<div>").addClass("notify-gradient").appendTo(notificationsElem);
            quickNotifyElem = $("<div>").addClass("quick-notify").appendTo(".wrapper");
        },

        notify(message = "", areaId = "", noQueue) {
            if(message.length > 0 && !endsWithPunctuation(message)) {
                message += ".";
            }

            if(areaId.length && Game.currentArea.id != areaId) {
                if(!noQueue) {
                    // create key in notifyQueue if it does not exist
                    if(!notifyQueue.hasOwnProperty(areaId)) {
                        notifyQueue[areaId] = [];
                    }
                    // add message to notifyQueue
                    notifyQueue[areaId].push(message);
                }
            } else {
                // areaId is current or not specified, print message directly
                printMessage(message);
            }
        },

        printQueue(areaId) {
            if(!notifyQueue.hasOwnProperty(areaId)) {
                return;
            }

            while(notifyQueue[areaId].length) {
                Notifications.printMessage(notifyQueue[areaId].shift());
            }
        },

        quickNotify(message = "") {
            if(message.length > 0 && !endsWithPunctuation(message)) {
                message += ".";
            }
            quickNotifyElem
                .stop()
                .text(message)
                .css("opacity", 1)
                .animate({ "opacity": 0 }, MESSAGE_FADE_OUT, "linear");
        },

        clearAll(duration = MESSAGE_FADE_OUT) {
            $(".notification")
                .stop()
                .animate({ "opacity": 0 }, duration, "linear", function () {
                    $(this).remove();
                });
        }
    };
})();