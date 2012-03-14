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

function _button_back(w, h, border, shadow, color) {

    var g = new Graphics();
    g.setStrokeStyle(1);
    g.beginFill(shadow);
    g.beginStroke(border);
    g.drawRoundRect(0, 0, w, h, 4);
    g.endFill();
    g.endStroke();

    var s = new Shape(g);
    var g2 = new Graphics();

    g2.beginFill(color);
    g2.drawRoundRect(3, 3, w - 6, h - 6, 2);
    g2.endFill();

    var s2 = new Shape(g2);
    s2.shadow = new Shadow(color, 1, 1, 5);

    var g3 = new Graphics();
    g3.beginFill(COLORS.WHITE);
    g3.drawRoundRect(3, 3, w - 6, h - 6, 2);
    g3.endFill();

    var s3 = new Shape(g3);
    s3.shadow = new Shadow(COLORS.WHITE, -1, -1, 5);
    var c = new Container();
    c.addChild(s);
    c.addChild(s3);
    c.addChild(s2);

    return c;
}

function add_toolbar_button(sprites, frame, place, events) {
    var button_back_container = _button_back(BUTTON.H, BUTTON.W, BUTTON.CBORDER, BUTTON.C1, BUTTON.C2);

    button_back_container.y = place * (1 + BUTTON.H);

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

    //  toolbar_container.addChild(s);

    add_toolbar_button(people_sprites, 'male2', 1, _people_events);
    update = true;
}

function handleImageLoad(event) {
    Ticker.addListener(window);
    return;
    var image = event.target;
    var bitmap;

    // create and populate the screen with random daisies:
    for (var i = 0; i < 100; i++) {
        bitmap = new Bitmap(image);
        daisy_container.addChild(bitmap);
        bitmap.x = canvas.width * Math.random() | 0;
        bitmap.y = canvas.height * Math.random() | 0;
        bitmap.rotation = 360 * Math.random() | 0;
        bitmap.regX = bitmap.image.width / 2 | 0;
        bitmap.regY = bitmap.image.height / 2 | 0;
        bitmap.scaleX = bitmap.scaleY = bitmap.scale = Math.random() * 0.4 + 0.6;
        bitmap.name = "bmp_" + i;

        // wrapper function to provide scope for the event handlers:
        (function (target) {
            bitmap.onPress = function (evt) {
                // bump the target in front of it's siblings:
                daisy_container.addChild(target);
                var offset = {x:target.x - evt.stageX, y:target.y - evt.stageY};

                // add a handler to the event object's onMouseMove callback
                // this will be active until the user releases the mouse button:
                evt.onMouseMove = function (ev) {
                    target.x = ev.stageX + offset.x;
                    target.y = ev.stageY + offset.y;
                    // indicate that the stage should be updated on the next tick:
                    update = true;
                }
            }
            bitmap.onMouseOver = function () {
                target.scaleX = target.scaleY = target.scale * 1.2;
                update = true;
            }
            bitmap.onMouseOut = function () {
                target.scaleX = target.scaleY = target.scale;
                update = true;
            }
        })(bitmap);
    }

    Ticker.addListener(window);
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

    handlePeopleLoad();
}

$(init);