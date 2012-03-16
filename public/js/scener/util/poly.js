

Graphics.prototype.polyShape = function(){
    var self = this;
    var args = arguments;
    args = _.toArray(args);

    var points = [];
    while (args.length > 0){
        if (args[0] instanceof Point){
            points.push(args.shift());
        } else {
            points.push(new Point(args[0], args[1]));
            args = args.slice(2)
        }
    }
    
    this.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(function(p){
        self.lineTo(p.x, p.y);
    })
    self.lineTo(points[0].x, points[0].y);
        
}

Graphics.prototype.polyLine = function(){
    var args = arguments;
    args = _.toArray(args);

    var points = [];
    while (args.length > 0){
        if (args[0] instanceof Point){
            points = args.shift();
        } else {
            points.push(new Point(args[0], args[1]));
            args = args.slice(2)
        }
    }

    this.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(function(p){
        this.lineTo(p.x, p.y);
    })

}