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
function init() {
    // create stage and point it to the canvas:
    canvas = document.getElementById("action_canvas");

    //check to see if we are running in a browser with touch support
    stage = new Stage(canvas);
    stage.addChild(daisy_container);
    stage.addChild(people_container);
    stage.addChild(toolbar_container);

    // enable touch interactions if supported on the current device:
    if (Touch.isSupported()) {
        Touch.enable(stage);
    }

    // enabled mouse over / out events
    stage.enableMouseOver(10);

    // load the source image:
    var image = new Image();
    image.src = "/img/daisy.png";
    image.onload = handleImageLoad;

    var person_image = new Image();
    person_image.src = "/js/scener/img/person.png";
    person_image.onload = handlePersonLoad;
}

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

                    var g = new Graphics();
                        g.setStrokeStyle(1);
                        g.beginStroke(Graphics.getRGB(0, 0, 0));
                        g.drawRoundRect(0, 0, 40, 40, 4);
                        g.endStroke();

                    t2.addChild(new Shape(g));

                    var offset = {x:t2.x - e2.stageX, y:t2.y - e2.stageY};

                    e2.onMouseMove = function (e3) {
                        t2.x = e3.stageX + offset.x;
                        t2.y = e3.stageY + offset.y;
                        update = true;
                    }
                    last_clicked = t2;

                }

                np_container.onMouseOver = function () {
                    t2.scaleX = t2.scaleY =  2;
                    update = true;
                }
                np_container.onMouseOut = function () {
                    t2.scaleX = t2.scaleY = 1;
                    update = true;
                }

            })(np_container);

            update = true;
        }


    })(person_button);

    stage.update();
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

$(init);