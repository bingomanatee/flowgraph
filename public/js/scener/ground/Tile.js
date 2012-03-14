function Tile(i, j, g) {
    this.i = i;
    this.j = j;
    this.ground = g;
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


}

function Ground(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.tiles = [];

}

Ground.prototype = {

    make_tiles:function (mini, minj, maxi, maxj) {
        for (var i = mini; i <= maxi; ++i) {
            for (var j = minj; j <= maxj; ++j) {
                this.tiles.push(new Tile(i, j, this));
            }
        }

    }

}