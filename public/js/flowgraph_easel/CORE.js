var FLOWGRAPH_CORE = {

    colors:{},

    toolbar:{
            button:{
                border:Graphics.getRGB(0, 0, 0),
                fill:Graphics.getHSL(300, 50, 80),
                width: 80,
                height: 60,
                stroke_width:2,
                label: {
                    x: 40,
                    y: 40
                }
            },


        events:{
            add_node:function (button) {
                button.onClick = function (event) {
                    var node = new FLOWGRAPH_CORE.Node();
                    FLOWGRAPH_CORE.stage.addChild(node);
                }
            }

        }
    },

    stage:null,

    templates: {}

}

$(function () {

    var canvas = document.getElementById('#flowgraph_canvas');

    FLOWGRAPH_CORE.stage = new Stage(canvas);

    var toolbar = new FLOWGRAPH_CORE.templates.Toolbar();

    FLOWGRAPH_CORE.stage.addChild(toolbar);

});
