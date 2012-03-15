(function (window) {


    function ToolbarButton(props) {
        _.extend(this, {
                height:16,
                width:16,
                stroke_width:1,
                border_color:COLORS.BLACK,
                color_1:COLORS.GREY50,
                color_2:COLORS.GREY95,
                color_3:COLORS.WHITE,
                corner_1:4,
                corner_2:2,
                front_inset:3,
                shadow_blur:5,
                shadow_offset:1
            },
            props
        )
        this.initialize();
    }

    var p = ToolbarButton.prototype = new Container();
    p.Container_initialize = p.initialize;

    p.initialize = function () {
        this.Container_initialize.call(this)
    }

    p._back_shape = function () {

        var g = new Graphics();
        g.setStrokeStyle(this.stroke_width);
        g.beginFill(this.color_1);
        g.beginStroke(this.border_color);
        g.drawRoundRect(0, 0, this.width, this.height, this.corner_1);
        g.endFill();
        g.endStroke();

        return new Shape(g);
    }

    p._front_shape = function () {
        var g = new Graphics();

        g.beginFill(this.color_2);
        g.drawRoundRect(this.front_inset, this.front_inset, this.width - (2 * this.front_inset), this.height - (2 * this.front_inset), this.corner_2);
        g.endFill();

        var s = new Shape(g);
        s.shadow = new Shadow(this.color_2, this.shadow_offset, this.shadow_offset, this.shadow_blur);
        return s;
    }

    p._hl_shape = function () {

        var g = new Graphics();
        g.beginFill(this.color_3);
        g.drawRoundRect(this.front_inset, this.front_inset, this.width - (2 * this.front_inset), this.height - (2 * this.front_inset), this.corner_2);
        g.endFill();

        var s = new Shape(g);
        s.shadow = new Shadow(this.color_3, -this.shadow_offset, -this.shadow_offset, this.shadow_blur);
        return s;
    }

    p.make = function () {
        var back_shape = this._back_shape();
        var front_shape = this._front_shape();
        var hl_shape = this._hl_shape();
        this.addChild(back_shape);
        this.addChild(hl_shape);
        this.addChild(front_shape);
    }

    /*
     _button_back(BUTTON.H, BUTTON.W, BUTTON.CBORDER, BUTTON.C1, BUTTON.C2);
     */

    window.ToolbarButton = ToolbarButton;
})(window);