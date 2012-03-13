var canvas;
var stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset = new Point();
var update = true;

var last_clicked = null;

var daisy_container = new Container();
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

function Person(frame, x, y) {
    this.frame = frame;
    this.move_to(x, y);
}

Person.prototype = {
    x:0,
    y:0,
    scale:1.0,

    container:null,

    move_to:function (x, y) {
        this.x = x;
        this.y = y;

        if (this.container) {
            this.container.x = this.x;
            this.container.y = this.y;
        }
    },

    scale_to:function (n) {
       this.scale = Math.min(5, Math.max(0.1, n));
        if (this.container){
            this.container.scaleX = this.container.scaleY = this.scale;
        }
    },

    add_to:function (container) {
        if (!this.container) {
            this._make();
        }

        container.addChild(this.container);
    },

    _make:function () {

        this.container = new Container();
        this.container.x = this.x;
        this.container.y = this.y;
        this.container.scaleX = this.container.scaleY = this.scale;

        var ani = new BitmapAnimation(people_sprites);
        ani.gotoAndStop(this.frame);
        this.container.addChild(ani);
    }
}

function _make_new_person(target, evt) {

    var p = new Person(_.shuffle(['male1', 'male2', 'female1', 'female2']).pop());
    p.scale_to(Math.round((Math.random() + Math.random()) * 16)/4);

    p.move_to(Math.round(Math.random() * 25) * 25 + 100,
        Math.round(Math.random() * 8) * 25 + 50);

    p.add_to(people_container);
    update = true;
}


function _people_events(button) {
    return (function (target) {
        button.onClick = function (evt) {
            _make_new_person(target, evt);
        }
    })
        (button);
}

function handlePeopleLoad(event) {
    Ticker.addListener(window);

    //  toolbar_container.addChild(s);

    add_toolbar_button(people_sprites, 'male2', 1, _people_events);
    update = true;
}

/*
 function handlePersonLoad(event) {
 var person_img = event.target;
 var icon_bitmap = new Bitmap(person_img);
 icon_bitmap.x = 4;
 icon_bitmap.y = 4;

 var g = new Graphics();
 g.setStrokeStyle(1);
 g.beginFill(Graphics.getRGB(200, 200, 200));
 g.beginStroke(Graphics.getRGB(0, 0, 0));
 g.drawRoundRect(0, 0, 40, 40, 4);
 g.endFill();
 g.endStroke();

 var person_button = new Shape(g);
 person_button.x = 2;
 person_button.y = 2;
 toolbar_container.addChild(person_button);
 toolbar_container.addChild(icon_bitmap);

 (function (target) {
 person_button.onClick = function (evt) {
 var np_container = new Container();
 np_container.x = np_container.y = 50;
 var bm = new Bitmap(person_img);
 bm.y = 2;
 np_container.addChild(bm);
 np_container.bm = bm;
 np_container.regX = 10;
 np_container.regY = 10;
 people_container.addChild(np_container);

 (function (t2) {
 np_container.onPress = function (e2) {


 var offset = {x:t2.x - e2.stageX, y:t2.y - e2.stageY};

 e2.onMouseMove = function (e3) {
 t2.x = e3.stageX + offset.x;
 t2.y = e3.stageY + offset.y;
 update = true;
 }
 last_clicked = t2;

 }

 np_container.onMouseOver = function () {
 var g = new Graphics();
 g.setStrokeStyle(1);
 g.beginStroke(Graphics.getRGB(0, 0, 0));
 g.drawRoundRect(0, 0, 40, 40, 4);
 g.endStroke();

 t2.addChild(new Shape(g));
 t2.scaleX = t2.scaleY = 2;
 update = true;
 }
 np_container.onMouseOut = function () {
 t2.scaleX = t2.scaleY = 1;
 t2.removeChildAt(1);
 update = true;
 }

 })(np_container);

 update = true;
 }


 })(person_button);

 stage.update();
 }
 */

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
    stage.addChild(daisy_container);
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