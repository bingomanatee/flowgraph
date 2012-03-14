(function () {

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

    function Person(frame, x, y) {

        this.init(frame, x, y);
    }


    var p = Person.prototype = new Container();
    p.Container_initialize = p.initialize;

    p.init = function (frame, x, y) {
        this.Container_initialize.call(this);
        this.frame = frame;
        this.x = x | 0;
        this.y = y | 0;
        var g = new Graphics();
        this._make();
    }

    p.frame = 'male1';
    p.scale = 1.0;
    p.scale_to = function (n) {
        this.scale = Math.min(5, Math.max(0.1, n));

        this.scaleX = this.scaleY = this.scale;
    }

    p._make = function () {
        if (this._made) return;
        var g = new Graphics();
        g.beginFill(COLORS.GREY95);
        g.drawRect(0, 0, 100, 100);
        g.endFill();
        var s2 = new Shape(g);
        this.addChild(s2);

        var ani = new BitmapAnimation(people_sprites);
        ani.gotoAndStop('male1');
        var s = new Shape(ani);
        s.x = 48;
        s.y = 24;
        this.addChild(s);

        (function (target) {
            target.onPress = function (e2) {


                var offset = {x:target.x - e2.stageX, y:target.y - e2.stageY};

                var to_sort = null;
                e2.onMouseMove = function (e3) {
                    target.x = e3.stageX + offset.x;
                    target.y = e3.stageY + offset.y;
                    update = true;
                    if (!to_sort) {
                        to_sort = setTimeout(function () {
                            sort_people();
                            to_sort = null;
                            update = true   // my wonderful global variable...
                        }, 250);
                    }
                }
            }
        })(this);
        this._made = true;
    }


    window.Person = Person;
} )(window);