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