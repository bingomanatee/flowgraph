function easely(class_name, base, base_name, p_extend) {
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

    _.defaults(p, p_extend);

    window[class_name] = f;

    return f;
}
