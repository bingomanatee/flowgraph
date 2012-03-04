flowgraph.Layer = function () {

    function _sort_sprites(s) {
        return s.index;
    }

    function _reindex_sprites(s, i){
        s.index = i;
    }

    function Layer(name) {
        this.name = name;
        this.sprites = new flowgraph.Stack(this.name);
    }

    Layer.prototype = {
        draw:function (ctx) {
   //         console.log('drawing layer', this.name);
            this.sprites.items().forEach(function (sprite) {
                sprite.draw(ctx);
            })
        },

        mouse_click: function(){
            var sprites = this.sprites.items(true);

            for (var s = 0; s < sprites.length; ++s){
                var sprite = sprites[s];
                if (!sprite){
                    throw new Error('no sprite');
                }
                if (sprite.mouse_over() && sprite.mouse_click()){
                    return true;
                }
            }
            return false;
        }
    }

    return Layer;
}()