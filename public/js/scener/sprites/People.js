(function (window) {

    function _y_sort(c) {
        return c.y * 100 + c.x / 1000;
    }

    function sort_people() {
        var c = SCENER_CORE.people_container.children;
        SCENER_CORE.people_container.children = _.sortBy(c, _y_sort);

    }

    SCENER_CORE.sprite_sheets.people = new SpriteSheet({
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

    var Person = easely('Person', Container, 'Container');
    var p = Person.prototype;

    p._post_initialize = function (frame, i, j) {
        this.Container_initialize.call(this);
        this.frame = frame;
        this.move_to(i, j);
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

        var t = new Text('Person (i' + this.i + ', j' + this.j + ')', '14pt serif bold', SCENER_CORE.COLORS.WHITE);
        var s2 = new Shape(t);
        s2.x = -20;
        s2.y = 12;
        this.addChild(s2);

        var ani = new BitmapAnimation(SCENER_CORE.sprite_sheets.people);
        ani.gotoAndStop(this.frame);
        var s = new Shape(ani);
        s.x = 0;
        s.y = -50;
        this.addChild(s);

        (function (target) {
            target.onPress = function (e2) {
                if (SCENER_CORE.mode) {
                    return;
                }

                var offset = {x:target.x - e2.stageX, y:target.y - e2.stageY};

                var to_sort = null;
                e2.onMouseMove = function (e3) {
                    var center = SCENER_CORE.ground.iso_to_xy({i:0, j:0});
                    target.x = e3.stageX + offset.x;
                    target.y = e3.stageY + offset.y;
                    target.x -= center.x;
                    target.y -= center.y;
                    target.x -= target.x % SCENER_CORE.ground.iso_diam_width;
                    target.y -= target.y % SCENER_CORE.ground.iso_diam_height;
                    target.x += center.x + 24;
                    target.y += center.y + 3;

                    SCENER_CORE.update = true;
                    if (!to_sort) {
                        to_sort = setTimeout(function () {
                            sort_people();
                            to_sort = null;
                            SCENER_CORE.update = true   // my wonderful global variable...
                        }, 250);
                    }
                }
            }
        })(this);
        this._made = true;
    }

    /**
     * @ERROR: ground identity.
     * @param i
     * @param j
     */
    p.move_to = function (i, j) {
        this.i = i;
        this.j = j;
        console.log('person at ', i, ',', j);
        SCENER_CORE.update = true;
        SCENER_CORE.ground.iso_to_xy(this).move_to(this);
        SCENER_CORE.ground.move_to(this);
    }


    window.Person = Person;
} )(window);