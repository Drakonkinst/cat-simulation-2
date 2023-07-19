const Game = (function() {
    return {
        versionStr: "alpha 2.001",
        
        activeModule: null,
        
        Init() {
            $(".content").empty();
            Database.Init();
            Notifications.Init();
            House.Init();
            
            let room = new Room();
            let cat = new Cat();
            room.addCat(cat);
            //room.addCat(new Cat());
            //room.addCat(new Cat());
            //Notifications.notify("Hello world 5!");
            Database.print("cat");
            Database.print("room");
            
            
        },
        
        Launch() {
            Logger.log("Game initializing...");
            Logger.log("Version is " + Game.versionStr);
            Logger.startTiming("Game initialization");
            
            Game.Init();
            
            Logger.mark();
        }
    };
})();

$(document).ready(function() {
    try {
        Game.Launch();
    } catch(err) {
        console.error("Error while launching:");
        console.error(err);
    }
});