function easely(class_name, base, base_name) {
    var bi = base_name + '_initialize';
    var f = function () {
        var args = arguments;
        this.initialize.apply(this, args);
    };
    var p = f.prototype = new base();
    p[bi] = p.initialize;

    p.initialize = function () {
        var args = arguments;
        if (this._pre_initialize) {
            this._pre_initialize.apply(this, args);
        }
        this[bi]();
        if (this._post_initialize) {
            this._post_initialize.apply(this, args);
        }
    }

    window[class_name] = f;

    return f;
}

Point.prototype.move_to = function (n) {
    n.x = this.x;
    n.y = this.y;
}

Point.prototype.distance_to = function (p) {
    if (!p instanceof Point){
        console.log('non point', p);
        throw new Error('Attempt to calc distance_to non-point');
    }
    var dx = this.x - p.x;
    var dy = this.y - p.y;

    return Math.sqrt(dx * dx + dy * dy);
}

Point.prototype.distance_to_xy = function (x, y) {
    var dx = this.x - x;
    var dy = this.y - y;

    return Math.sqrt(dx * dx + dy * dy);
}