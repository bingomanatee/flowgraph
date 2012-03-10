flowgraph.util.Point = function () {

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    Point.snap_angle = function (a, inc, start) {
        if (!start) {
            start = 0;
        }
        start = start % inc;

        var snap_a = start;
        var snap_dist = Point.angle_dist(start, a);

        for (var sa = start; sa < Math.PI * 2; sa += inc) {
            var dist = Point.angle_dist(sa, a);
            if (dist < snap_dist) {
                snap_dist = dist;
                snap_a = sa;
            }
        }
        return snap_a;
    }

    Point.angle_dist = function (a, b) {
        var dist = Math.abs(a - b);
        if (dist > Math.PI) {
            dist = (2 * Math.PI) - dist;
        }
        return dist;
    }

    Point.angle_range = function (a) {
        var c = Math.PI * 2;
        while (a < 0) {
            a += c;
        }
        while (a > c) {
            a -= c;
        }
        return a;
    }

    Point.prototype = {

        rel_angle:function (p) {
            if (this.equals(p)) {
                //    console.log('equal points ', this.toString(), 'and', p.toString(), 'compared');
                return 0;
            }

            var out = Math.atan2(p.y - this.y, p.x - this.x);
            //   console.log('from', this.toString(), 'to', this.toString(), ':', out);

            return Point.angle_range(out);
        },

        toString:function () {
            return '(' + parseInt(this.x) + ',' + parseInt(this.y) + ')';
        },

        to_a:function () {
            return [this.x, this.y];
        },

        vector:function (a, m, relative) {
            if (!m) {
                m = 1;
            }
            var v = new Point(Math.cos(a) * m, Math.sin(a) * m);
            if (relative) {
                return this.add(v);
            } else {
                return v;
            }
        },

        ra_nsew:function (p) {
            var a = this.rel_angle(p);
            if (a < Math.PI / 4) {
                return 0;
            } else if (a < Math.PI * 3 / 4) {
                return Math.PI / 2;
            } else if (a < Math.PI * 5 / 4) {
                return Math.PI;
            } else if (a < Math.PI * 7 / 4) {
                return Math.PI * 3 / 2;
            } else {
                return 0;
            }
        },

        equals:function (p) {
            return (this.x == p.x) && (this.y == p.y);
        },

        scale:function (scale) {
            return new Point(this.x * scale, this.y * scale);
        },

        scale_self:function (scale) {
            this.x *= scale;
            this.y *= scale;
            return this;
        },

        avg:function (p) {
            var out = this.add(p).scale(0.5);
            return out;
        },

        dist:function (p, y) {
            if (arguments.length > 1) {
                var xd = p - this.x;
                var yd = y - this.y;
            } else {
                var xd = p.x - this.x;
                var yd = p.y - this.y;
            }
            return Math.sqrt((xd * xd) + (yd * yd));
        },

        add:function (p, y) {
            if (arguments.length > 1) {
                var out = new Point(this.x + p, this.y + y);
                //      console.log('offsetting', this.toString(), 'by ', p, y, out.toString());
                return out;
            }

            return new Point(this.x + p.x, this.y + p.y);
        }

    }

    return Point;
}
    ();