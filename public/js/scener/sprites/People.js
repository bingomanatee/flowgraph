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
        if (this.container) {
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

        this.container = self_container = new Container();
        this.container.x = this.x;
        this.container.y = this.y;
        this.container.scaleX = this.container.scaleY = this.scale;

        var ani = new BitmapAnimation(people_sprites);
        ani.gotoAndStop(this.frame);
        this.container.addChild(ani);

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
                            update = true
                        }, 250);
                    }
                }
            }
            target.onRelease = function (e2) {
                update = true;
            }
        })(this.container)
    }
}

function _make_new_person(target, evt) {

    var p = new Person(_.shuffle(['male1', 'male2', 'female1', 'female2']).pop());
    p.scale_to(Math.round((Math.random() + Math.random()) * 16) / 4);

    p.move_to(Math.round(Math.random() * 25) * 25 + 100,
        Math.round(Math.random() * 8) * 25 + 50);

    p.add_to(people_container);
    sort_people();
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