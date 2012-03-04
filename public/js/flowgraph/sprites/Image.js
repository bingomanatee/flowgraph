
flowgraph.sprites.Image = function(props) {
    this.name = 'untitled';
    this.top = 0;
    this.left = 0;
    this.layer = -1;
    this.loaded = false;
    _.extend(this, props);

    this.image = new Image();
    this.image.src = this.src;

    var self = this;

    this.image.onload = function () {
        self.loaded = true;
    }
}

flowgraph.sprites.Image.prototype = {

    draw:function (ctx) {
        if (this.loaded) {
            ctx.drawImage(this.image, this.left, this.top);
            //        console.log('drawing', this.image.src);
        } else {
            //      console.log('cannot draw ', this.image.src, ' ... not loaded');
        }
    }

}