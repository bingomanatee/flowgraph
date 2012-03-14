var canvas;
var stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset = new Point();
var update = true;

var last_clicked = null;

var ground_container = new Container();
var people_container = new Container();


var toolbar_container = new Container();

var COLORS = {
    BLACK:Graphics.getHSL(0, 0, 0, 1),
    WHITE:Graphics.getHSL(0, 0, 100, 1)
}

for (var v = 0; v <= 100; v += 5) {
    COLORS['GREY' + v] = Graphics.getHSL(0, 0, v, 1);
    COLORS['RED' + v] = Graphics.getHSL(0, 1, v, 1);
    COLORS['YELLOW' + v] = Graphics.getHSL(60, 1, v, 1);
    COLORS['GREEN' + v] = Graphics.getHSL(120, 1, v, 1);
    COLORS['TEAL' + v] = Graphics.getHSL(180, 1, v, 1);
    COLORS['BLUE' + v] = Graphics.getHSL(240, 1, v, 1);
    COLORS['MAGENTA' + v] = Graphics.getHSL(300, 1, v, 1);
}

var BUTTON = {
    H:60,
    W:80,
    CBORDER:COLORS.BLACK,
    C1:COLORS.GREY20,
    C2:COLORS.GREY95
};

function _y_sort(c) {
    return c.y * 100 + c.x / 1000;
}


var people_sprites = new SpriteSheet({
    images:['/js/scener/img/people.png'],
    frames:{width:48, height:48, count:6, regX:24, regy:24},
    animations:{
        template:[0, 0],
        male1:[1, 1],
        female1:[2, 2],
        male2:[3, 3],
        female2:[4, 4]
    }
});

function sort_people() {
    var c = people_container.children;
    people_container.children = _.sortBy(c, _y_sort);

}

console.log('button: ', BUTTON);
console.log('colors: ', COLORS);

function add_toolbar_button(sprites, frame, place, events) {
    var button_back_container = new ToolbarButton({width: 64, height: 64});

    button_back_container.y = place * (1 + BUTTON.H);
    button_back_container.make();

    var ani = new BitmapAnimation(sprites);
    ani.gotoAndStop(frame);
    var s = new Shape(ani);
    s.x = (BUTTON.W - ani.spriteSheet._frameWidth);
    s.y = (BUTTON.H - ani.spriteSheet._frameHeight);
    button_back_container.addChild(s);
    events(button_back_container);

    toolbar_container.addChild(button_back_container);
    update = true;
}

function handlePeopleLoad(event) {
    Ticker.addListener(window);

    function _new_person(target){
        target.onClick = function(evt){
            var p = new Person();
            p.x = Math.random() * 400;
            p.y = Math.random() * 300;
            people_container.addChild(p);
            update = true;
        }
    }

    add_toolbar_button(people_sprites, 'male2', 1, _new_person);
    update = true;
}

function tick() {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        stage.update();
    }
}

function init() {
    // create stage and point it to the canvas:
    canvas = document.getElementById("action_canvas");

    //check to see if we are running in a browser with touch support
    stage = new Stage(canvas);
    stage.addChild(ground_container);
    stage.addChild(people_container);
    stage.addChild(toolbar_container);

    // enable touch interactions if supported on the current device:
    /*  if (Touch.isSupported()) {
     Touch.enable(stage);
     } */

    // enabled mouse over / out events
    stage.enableMouseOver(10);
    var ground = new Ground();
    ground.init_terrain(20, 20);
    ground.x = ground.y = 200;
    ground_container.addChild(ground);

    handlePeopleLoad();
}

$(init);