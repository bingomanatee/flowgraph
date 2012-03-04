flowgraph.sprites.Toolbar = function () {

    function Toolbar_tile(props, toolbar, offset) {
        _.extend(this, props);
        this.prep_tile(toolbar, offset);
    }

    Toolbar_tile.prototype = {

        prep_tile:function (toolbar, i) {
            var tile = this;

            var top = toolbar.top;
            var left = toolbar.left;
            var right = left + toolbar.tile.width;
            var bottom = top + toolbar.tile.height;

            if (toolbar.tile.dir == 'v') {
                var offset = toolbar.tile.height * i;
                top += offset;
                bottom += offset;
            } else {
                var offset = toolbar.tile.width * i;
                left += offset;
                right += offset;
            }
            tile.left = left;
            tile.top = top;
            tile.right = right;
            tile.bottom = bottom;
            tile.width = toolbar.tile.width;
            tile.height = toolbar.tile.height;

            tile.toolbar = toolbar;
            //console.log('created tile', tile, 'from', toolbar);
        },

        draw_selected:function (ctx) {
            var stops = [
                {stop:0.125, color:'rgba(255,255,255,0.25)'},
                {stop:0.8, color:'rgba(0,0,0,0.75)'}
            ];
            var range = [
                this.left + this.width / 2, this.top + this.height / 2, 0,
                this.left + this.width / 2, this.top + this.height / 2, Math.max(this.width, this.height)
            ];
            var grad = flowgraph.draw.grad(ctx, stops, range, 'radial');
            flowgraph.draw.rect(ctx, this.dim(), {fill:grad});
        },

        dim:function () {
            return [this.left, this.top, this.width, this.height];
        },

        hl:function (ctx) {
            flowgraph.draw.rect(ctx, this.dim(), {
                stroke:{width:2, style:'rgb(204,51,0)'},
                fill:'rgba(255, 102, 0, 0.2)'});
        },
        nohl:function (ctx) {
            flowgraph.draw.rect(ctx, this.dim(),
                {
                    stroke:{width:1, style:'rgb(102,102,102)'}
                });
        },

        _on_click:function () {
        },

        mouse_over:function () {
            return flowgraph.mouse.in_rect(this.left, this.top, this.right, this.bottom);
        },

        reset: function(){
            if (this._on_reset){
                this._on_reset();
            }
        },

        mouse_click:function () {
            if (this.mouse_over()) {
                console.log('toolbar.tiles.mouse_click: resettting old tile');
                if (this.toolbar.selected_tile) {
                    console.log('... found');
                    this.toolbar.selected_tile.reset();
                }
                this.toolbar.selected_tile = this;
                return true;
            } else {
                return false;
            }
        }

    }

    function Toolbar(props) {
        this.top = 0;
        this.left = 0;
        this.layer = -1;
        this.tile = {
            dir:'v',
            width:50,
            height:30
        };
        this.tiles = [];

        _.extend(this, props);

        this.image = new flowgraph.sprites.Image(this.image);

        var self = this;

        this.tiles.forEach(function (tile, i) {
            self.tiles[i] = new Toolbar_tile(tile, self, i);

        });

    }

    Toolbar.prototype = {
        selected_tile:null,
        draw:function (ctx) {
            //   ctx.save();
            //    ctx.translate(this.left, this.top);
            this.image.draw(ctx);
            this.tile_draw(ctx);
            //     ctx.restore();
        },

        mouse_over:function () {
            var last_tile = this.tiles[this.tiles.length - 1];
            var first_tile = this.tiles[0];

            var left = first_tile.left;
            var top = first_tile.top;
            var bottom = last_tile.bottom;
            var right = last_tile.right;

            return flowgraph.mouse.in_rect(left, top, right, bottom);
        },

        mouse_click:function () {
            for (var i = 0; i < this.tiles.length; ++i) {
                var tile = this.tiles[i];
                if (tile.mouse_click()) {
                    tile._on_click();
                    return true;
                }
            }
            return false;
        },

        tile_draw:function (ctx) {
            // @TODO: cache dims
            var tile = false;
            var offset = -1;
            if (this.selected_tile) {
                this.selected_tile.draw_selected(ctx);
            } else {
                this.tiles[0].draw_selected(ctx);
            }
            this.tiles.forEach(function (t, i) {
                t.nohl(ctx);
                if ((!tile) && (t.mouse_over())) {
                    tile = t;
                    offset = i;
                }
            });

            if (tile) {
                tile.hl(ctx);
            }
        }

    }

    return Toolbar;
}()

