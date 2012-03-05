flowgraph.Layer = function () {

    function _sort_sprites(s) {
        return s.index;
    }

    function _reindex_sprites(s, i){
        s.index = i;
    }

    function Layer(id) {
        this.id = id;
        this.sprites = new flowgraph.Stack(this.id);
    }

    Layer.prototype = {
        items: function (r){
            return this.sprites.items(r);
        },

        get: function(item){
            return this.sprites.get(item);
        },

        draw:function (ctx) {
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