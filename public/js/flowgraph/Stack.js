flowgraph.Stack = function () {

    function Stack(name) {
        this.name = name;
        this.ordered = null;
        this.reversed = null;
        this.stack = [];
    }

    function _index(i) {
        return i.index;
    }

    function _index_rev(i) {
        return i.index * -1;
    }

    function _name(i) {
        return i.name;
    }

    function _order(stack) {
        var ostack = _.sortBy(stack.stack, _ordered);
        //      console.log('ordered stack: ', Stack.prototype.toString.call({stack: ostack}));
        stack.ordered = _.map(ostack, _item);
        //    console.log('ordered stack names: ', _.map(stack.ordered, _name).join(','));
    }

    function _item(i) {
        return i.item;
    }

    function _reverse(stack) {
        if (null === stack.ordered) {
            _order(stack);
        }
        stack.reversed = stack.ordered.reverse();
        //       console.log('reversed stack names: ', _.map(stack.reversed, _name).join(','));
    }

    Stack.prototype = {

        toString:function () {
            var out = [];
            this.stack.forEach(function (s) {
                out.push('index: ' + s.index + ", name: " + s.item.name);
            });

            return out.join("\n");
        },

        add:function (item, index) {
            if (!item) {
                throw new Error('Attempt to add nothing');
            }
            if (!item.name) {
                throw new Error('Attempt to add unnamed item');
            }
            if (arguments.length < 2) {
                index = -1;
            }
            this.stack.push({item:item, index:index});

            _.sortBy(this.stack, _item).forEach(function (item, i) {
                item.index = i;
            });

            if (this._on_add) {
                this._on_add();
            }
        },

        get:function (name) {
            for (var i = 0; i < this.stack.length; ++i) {
                if (this.stack[i].item.name == name) {
                    return this.stack[i].item;
                }
            }
            return null;
        },

        remove:function (item) {
            if (_.isString(item)) {
                item = this.get(item);
            }

            this.stack = _.filter(this.stack, function (stack_item) {
                return stack_item.item !== item;
            })
            this.ordered = null;
            this.reversed = null;
        },

        items:function (reversed) {
            if (reversed) {
                var out = _.sortBy(this.stack, _index_rev);
            } else {
                var out = _.sortBy(this.stack, _index);
            }
            return _.map(out, _item);
        }

    }

    return Stack;
}();