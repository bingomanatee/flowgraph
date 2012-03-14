function Tile(i, j, g, type) {
    this.i = i;
    this.j = j;
    this.ground = g;
    this.type = type ? type : 0;
}

Tile.prototype = {

    center:function (reload) {
        if (reload || (!this._center)) {

            var w_count = this.i - this.j;
            var h_count = -1 * (this.i + this.j);
            this._center = Point(w_count * this.ground.w, h_count * this.ground.h);
        }
        return this._center;
    },

    as_graphic:function () {

        var start = this.ground.isoPoint(this.i + 0.5, this.j, 0);
        var dims = [start,
            this.ground.isoPoint(this.i, this.j + 0.5, 0),
            this.ground.isoPoint(this.i - 0.5, this.j, 0),
            this.ground.isoPoint(this.i, this.j - 0.5, 0),
            start
        ];

        if (!this.type){
            return this._draw_void(dims);
        }
    } ,

    _draw_void: function(dims){
        var g = new Graphic();
        g.openP
    }

}

