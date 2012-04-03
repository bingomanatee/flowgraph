
function _fancybranch_bg(ctx, x, y, w, h) {
    ctx.beginPath();

    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h + h);
    ctx.lineTo(x - w, y + h);
    ctx.lineTo(x, y);

    ctx.closePath();
    ctx.fill();
}

function _fancynode_bg(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x - w + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h + h - r);
    ctx.quadraticCurveTo(x + w, y + h + h, x + w - r, y + h + h);
    ctx.lineTo(x - w + r, y + h + h);
    ctx.quadraticCurveTo(x - w, y + h + h, x - w, y + h + h - r);
    ctx.lineTo(x - w, y + r);
    ctx.quadraticCurveTo(x - w, y, x - w + r, y);
    ctx.closePath();
    ctx.fill();
}

function _fancynode_plusbtn(ctx, x, y, w, h, r, active) {

    if (active) {
        ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
    }
    var px = x + w - r - r;
    var py = y + h + h - r - r;

    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgb(204, 255, 204)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px - 3, py);
    ctx.lineTo(px , py + 3);
    ctx.lineTo(px + 3, py);
    ctx.closePath();
    ctx.stroke();
}

function _fancynode_contains(node, pos) {
    var npos = node.pos;
    var width = node.getData('width');
    var height = node.getData('height');
    var dy = Math.abs(pos.y - height / 4 - npos.y);
    //console.log('pos: ', pos.x, ',', pos.y, ', node pos: ', npos.x, npos.y, width, height);
    if (Math.abs(pos.x - npos.x) <= width / 2 && dy <= height / 4) {

        if (pos.x < npos.x) {
            if (pos.y < npos.y + height / 4) {
                node.setData('quadrant', 'TL');
            } else {
                node.setData('quadrant', 'BL');
            }
        } else {
            if (pos.y < npos.y + height / 4) {
                node.setData('quadrant', 'TR');
            } else {
                node.setData('quadrant', 'BR');
            }
        }

        return true;
    } else {
        return false;
    }

}

function _fancynode_checked(ctx, x, y, w, h, node) {
    ctx.beginPath();
    ctx.arc(x - w + 7, y + 7, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0, 0, 0,0.5)';
    if (node.getData('checked')) {
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgb(255,255,225)';
    } else {
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(102,102,102,0.5)';
    }
    ctx.stroke();
    ctx.fill();
}

$jit.ForceDirected.Plot.NodeTypes.implement({
        'fancynode':{
            'render':function (node, canvas) {
                if (!node) {
                    return;
                }
                var ctx = canvas.getCtx();
                var fs = ctx.fillStyle;
                var ss = ctx.strokeStyle;
                var lw = ctx.lineWidth;

                var pos = node.pos.getc(true);
                var nconfig = this.node;
                var width = nconfig.width, height = nconfig.height;
                var npos = node.pos.getc(true);


                var x = npos.x;
                var y = npos.y;
                var h = height;
                var w = width / 2;
                var r = 4; //corner radius

                _fancynode_bg(ctx, x, y, w, h, r);
                var q = node.getData('quadrant');
                _fancynode_plusbtn(ctx, x, y, w, h, r, (q == 'BR'));

                ctx.fillStyle = fs;
                _fancynode_checked(ctx, x, y, w, h, node);

                ctx.fillStyle = fs;
                ctx.strokeStyle = ss;
                ctx.lineWidth = lw;
            },
            'contains':_fancynode_contains
        }
    }
);

$jit.ForceDirected.Plot.NodeTypes.implement({
        'fancybranch':{
            'render':function (node, canvas) {
                if (!node) {
                    return;
                }
                var ctx = canvas.getCtx();
                var fs = ctx.fillStyle;
                var ss = ctx.strokeStyle;
                var lw = ctx.lineWidth;

                var pos = node.pos.getc(true);
                var nconfig = this.node;
                var width = nconfig.width, height = nconfig.height;

                var x = pos.x;
                var y = pos.y;
                var h = height;
                var w = width / 2;
                var r = 4; //corner radius

                _fancybranch_bg(ctx, x, y, w, h);
                var q = node.getData('quadrant');
                _fancynode_plusbtn(ctx, x, y, w, h, r, (q == 'BR'));

                ctx.fillStyle = fs;
                _fancynode_checked(ctx, x, y, w, h, node);

                ctx.fillStyle = fs;
                ctx.strokeStyle = ss;
                ctx.lineWidth = lw;
            },
            'contains':_fancynode_contains
        }
    }
);

$jit.ForceDirected.Plot.NodeTypes.implement({
        'joint':{
            'render':function (node, canvas) {
            },
            'contains': function(node, pos){
              var npos = node.pos.getc(true),
                  dim = node.getData('dim');
              return this.nodeHelper.circle.contains(npos, pos, dim);
            }
        }
    }
);