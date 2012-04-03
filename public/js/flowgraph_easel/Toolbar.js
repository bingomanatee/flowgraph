$(function(){

    var Toolbar_Button = easely('Toolbar_Button', Container, 'Container', {
        _pre_initialize: function(name, index, action){
            this.name = name;
            this.index = this;
            action(this);
        },

        _post_initialize: function(){

            var g = new Graphics();
            g.beginStroke(FLOWGRAPH_CORE.toolbar.button.border).setStrokeStyle(FLOWGRAPH_CORE.toolbar.button.stroke_width);
            g.beginFill(FLOWGRAPH_CORE.colors.button.fill);
            g.drawRoundRect(0, 0, FLOWGRAPH_CORE.toolbar.button.width, FLOWGRAPH_CORE.toolbar.button.height);
            var s = new Shape(g);

            this.add(s);

            var t = new Text(this.name,  "16px bold Arial");
            t.x = FLOWGRAPH_CORE.toolbar.button.label.x;
            t.y = FLOWGRAPH_CORE.toolbar.button.label.y;
            t.textAlign = 'center';
            this.add(s);

        }
    });


    FLOWGRAPH_CORE.templates.Toolbar = easely('Toolbar', Container, 'Container', {

        _post_initialize: function(){

            this.add_child(new Toolbar_Button('New Node', 0, FLOWGRAPH_CORE.toolbar.events.add_node));

        }


    });


});