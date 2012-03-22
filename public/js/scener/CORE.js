var SCENER_CORE = (function()
    {
        var core = {update: false, mode: '', on_inits: [], sprites: {}, mouse_update_inc: 10};

        return core;
    })();

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset = new Point();

var last_clicked = null;

function tick() {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (SCENER_CORE.update) {
        SCENER_CORE.update = false; // only SCENER_CORE.update once
        SCENER_CORE.stage.update();
    }
}

function init() {
    // create stage and point it to the canvas:
    SCENER_CORE.canvas = document.getElementById("action_canvas");
    SCENER_CORE.ground_container = new Container();
    SCENER_CORE.people_container = new Container();
    SCENER_CORE.toolbar_container = new Container();

    SCENER_CORE.stage = new Stage(SCENER_CORE.canvas);
    SCENER_CORE.stage.addChild(SCENER_CORE.ground_container);
    SCENER_CORE.stage.addChild(SCENER_CORE.people_container);
    SCENER_CORE.stage.addChild(SCENER_CORE.toolbar_container);

    SCENER_CORE.on_inits.forEach(function(f){
        f();
    });
    SCENER_CORE.stage.enableMouseOver(SCENER_CORE.mouse_update_inc);
}

$(init);