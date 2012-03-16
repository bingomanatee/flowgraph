(function (window) {

    var grass_sprite_sheet = new SpriteSheet({
        images:['/js/scener/img/grass.png'],
        frames:{width:24, height:24, count:4, regX:12, regy:12},
        animations:{
            fresh:[0, 0],
            yellow:[1, 1],
            sparse:[2, 2],
            dirt:[3, 3]
        }
    });

    var Ground_Tile = easely('Ground_Tile', Container, 'Container');

    Ground_Tile.prototype._gpn_net = function (w, count, i, j) {
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


    Ground_Tile.prototype.grid_point_near = function (x, y) {
        var p = new Point(x, y);
        var net = this._gpn_net(1, 20, 0, 0);
        net.forEach(function (net_data) {
            net_data.dist = net_data.p.distance(p);
        });
    }

    Ground_Tile.prototype._pre_initialize = function (g, i, j) {
        this.ground = g;
        this.i = i;
        this.j = j;
        this.k = 0;
    }

    Ground_Tile.prototype._post_initialize = function () {
        var g = new Graphics();
        g.setStrokeStyle(5);
        g.beginStroke(COLORS.GREEN45a20);
        g.beginFill(COLORS.GREEN20);

        var north = this.ground.iso_to_xy({i:this.get_i() + 0.5, j:this.get_j() + 0.5, k:0});
        var south = this.ground.iso_to_xy({i:this.get_i() - 0.5, j:this.get_j() - 0.5, k:0});
        var east = this.ground.iso_to_xy({i:this.get_i() + 0.5, j:this.get_j() - 0.5, k:0});
        var west = this.ground.iso_to_xy({i:this.get_i() - 0.5, j:this.get_j() + 0.5, k:0});
        g.polyShape(north, east, south, west);
        g.endFill();

        g.beginBitmapFill(grass_image);
        g.polyShape(north, east, south, west);
        g.endFill();
        g.endStroke();

        this.addChild(new Shape(g));

        var xy_point = this.ground.iso_to_xy({i:this.get_i(), j:this.get_j()});
        var txt = '(i: ' + this.get_i() + ', j: ' + this.get_j() + ')'
        var t = new Text(txt, '20 pt serif', COLORS.WHITE);
        xy_point.move_to(t);
        var st = new Shape(t);
        xy_point.move_to(st);
        st.x -= 40;
        //  this.addChild(st);

        var xy = '(x: ' + xy_point.x + ', y: ' + xy_point.y + ')';
        t = new Text(xy, '20 pt serif', COLORS.WHITE);
        var st2 = new Shape(t);
        xy_point.move_to(st2);
        st2.x -= 40;
        st2.y += 15;
        //  this.addChild(st2);
    }

    Ground_Tile.prototype.get_i = function () {
        return this.i + this.ground.i_min;
    }

    Ground_Tile.prototype.get_j = function () {
        return this.j + this.ground.j_min;
    }

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

    p.init_terrain = function (i_count, j_count) {
        this.frame_of_ref = new Container();
        this.frame_of_ref.ground = this;
        var self = this;
        var tiles;
        this.i_count = i_count;
        this.j_count = j_count;

        //@TODO: proper garbager collection on old tile set
        this.tiles = tiles = [];
        _.range(i_count).forEach(function (i) {
            tiles[i] = [];
            _.range(j_count).forEach(function (j) {
                var t;
                tiles[i][j] = t = new Ground_Tile(self, i, j);
                self.frame_of_ref.addChild(t);
            })
        })
        var g = new Graphics();

        g.beginFill(COLORS.RED50);
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

    window.Ground = Ground;
} )(window);