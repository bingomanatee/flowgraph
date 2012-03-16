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

    var p = Ground_Tile.prototype;
    p._pre_initialize = function (g, i, j) {
        this.ground = g;
        this.i = i;
        this.j = j;
        this.k = 0;
    }

    p._post_initialize = function () {
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

      p.center = function(reset){
          if (reset || (!this._center)){
              return this._center = this.ground.iso_to_xy({i: this.get_i(), j: this.get_j()});
          }
      }

    p.get_i = function () {
        return this.i + this.ground.i_min;
    }

    p.get_j = function () {
        return this.j + this.ground.j_min;
    }


})(window)