(function (window) {

    var Ground = easely('Ground', Container, 'Container');

    var p = Ground.prototype;

    /**
     * Note - this is true ijk; the i_min and j_min serve only
     * to contextualize the array of ground_tiles.
     * @param ijk
     */
    p.iso_to_xy = function (ijk) {
        var i = ijk.i;
        var j = ijk.j;
        var k = ijk.hasOwnProperty('k') ? ijk.k : 0;

        var x = (i - j) * this.iso_diam_width;
        var y = (i + j) * this.iso_diam_height * -1;
        y += k * this.iso_height * -1;

        return new Point(x, y);
    };

    _.extend(p, {
        iso_diam_width:50,
        iso_diam_height:25,
        iso_height:30,
        i_count:0,
        j_count:0,
        i_min:0,
        j_min:0,
        k_min:0
    });

    p.each_tile = function (f) {
        if (this._each_tile) {
            this._each_tile.forEach(f);
        }
    };

    p.init_terrain = function (i_count, j_count) {
        this.frame_of_ref = new Container();
        this.frame_of_ref.ground = this;
        var self = this;
        var tiles;
        this.i_count = i_count;
        this.j_count = j_count;
        this._each_tile = [];

        //@TODO: proper garbager collection on old tile set
        this.tiles = tiles = [];
        _.range(i_count).forEach(function (i) {
            tiles[i] = [];
            _.range(j_count).forEach(function (j) {
                var t;
                tiles[i][j] = t = new Ground_Tile(self, i, j);
                self.frame_of_ref.addChild(t);
                self._each_tile.push(t);
            })
        })
        var g = new Graphics();

        g.beginFill(SCENER_CORE.COLORS.RED50);
        g.polyShape(
            this.iso_to_xy({i:0.2, j:0.2, k:0}),
            this.iso_to_xy({i:-0.2, j:0.2, k:0}),
            this.iso_to_xy({i:-0.2, j:-0.2, k:0}),
            this.iso_to_xy({i:0.2, j:-0.2, k:0})
        );
        g.endFill();
        this.frame_of_ref.addChild(new Shape(g));
        var center = this.iso_to_xy({i:0, j:0, k:0});
        this.frame_of_ref.x = -center.x;
        this.frame_of_ref.y = -center.y;
        this.addChild(this.frame_of_ref);
    }

    p.move_to = function (n) {
        this.localToGlobal(n.x, n.y).move_to(n);
    }


    p._gpn_net = function (w, count, i, j) {
        var min_i = i - (w * count);
        var max_i = i + (w * count);
        var min_j = j - (w * count);
        var max_j = j + (w * count);

        var out = [];
        for (var net_i = min_i; net_i <= max_i; net_i += w) {
            for (var net_j = min_j; net_j <= max_j; net_j += w) {
                var o = {i:net_i, j:net_j};
                out.push(_.extend(o, { p:this.iso_to_xy(o)}));
            }
        }
        return out;
    }

    /**
     * find the nearest tile to a given x y stage coord.
     * @TODO: binary search
     */
    p.tile_near = function (x, y) {
        var ground = this;
        var p = new Point(x, y);
        var distance = 100000000;
        var nearest = null;
        var net = this._gpn_net(1, 20, 0, 0);
        this.each_tile(function (tile) {
            var p = ground.iso_to_xy(tile);
            var d = p.distance_to_xy(x, y);
            if (d < distance) {
                nearest = tile;
                distance = d;
            }
        });

        return nearest;
    }

    SCENER_CORE.sprites.Ground = Ground;
} )(window);