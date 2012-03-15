/*

 function Ground(props) {
 _.extend(this, Ground.DEFAULTS, props);

 this.tiles = [];

 }
 Ground.defaults = {
 x: 0,
 y: 0,
 w: 50,
 h: 25,
 i1: -5,
 j1: 5,
 i_count: 11,
 j_count: 11
 }

 Ground.prototype = {

 make_tiles:function () {
 _.range(this.i1, this.i1 + this.i_count).forEach(
 function(i){
 this.tiles[i] = [];
 _.range(this.j1, this.j1 + this.j_count).forEach(
 function(j){
 this.tiles[i][j] = new Tile(i, j, this);
 }
 )
 }
 )

 }

 }
 */

(function (window) {

    var Ground_Tile = easely('Ground_Tile', Container, 'Container');

    Ground_Tile.prototype._pre_initialize = function (g, i, j) {
        this.ground = g;
        this.i = i;
        this.j = j;
        this.k = 0;
    }

    Ground_Tile.prototype._post_initialize = function () {
        var g = new Graphics();
        g.beginStroke(COLORS.BLACK);
        g.beginFill(COLORS.GREEN50);

        var north = this.ground.iso_to_xy({i:this.i + 0.5, j:this.j + 0.5, k:0});
        var south = this.ground.iso_to_xy({i:this.i - 0.5, j:this.j - 0.5, k:0});
        var east = this.ground.iso_to_xy({i:this.i + 0.5, j:this.j - 0.5, k:0});
        var west = this.ground.iso_to_xy({i:this.i - 0.5, j:this.j + 0.5, k:0});

        g.moveTo.call(g, north.x, north.y)
        g.lineTo.call(g, east.x, east.y);
        g.lineTo.call(g, south.x, south.y);
        g.lineTo.call(g, west.x, west.y);
        g.lineTo.call(g, north.x, north.y);
        g.endFill();
        g.endStroke();
        this.ground_shape = new Shape(g);
        this.addChild(this.ground_shape);
    }

    function Ground(props) {

        this.init(props);
    }

    var p = Ground.prototype = new Container();
    p.Container_initialize = p.initialize;

    p.init = function (props) {
        this.Container_initialize.call(this);
        if (props) _.extend(props);
    }

    p.iso_to_xy = function (ijk) {
        var x = (ijk.i - ijk.j) * this.iso_diam_width;
        var y = (ijk.i + ijk.j) * this.iso_diam_height * -1;
        if (ijk.k) {
            y += ijk.k * this.iso_height * -1;
        }
        return new Point(x, y);
    };

    _.extend(p, {
        iso_diam_width:50,
        iso_diam_height:25,
        iso_height:30,
        i_count:0,
        j_count:0
    });

    p.init_terrain = function (i_count, j_count) {
        var self = this;

        this.i_count = i_count;
        this.j_count = j_count;
        //@TODO: proper garbager collection on old tile set
        this.tiles = tiles = [];
        _.range(i_count).forEach(function (i) {
            tiles[i] = [];
            _.range(j_count).forEach(function (j) {
                var t;
                tiles[i][j] = t = new Ground_Tile(self, i, j);
                self.addChild(t);
            })
        })
    }

    window.Ground = Ground;
} )(window);