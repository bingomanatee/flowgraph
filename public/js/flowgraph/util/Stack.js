flowgraph.Stack = function () {

    function Stack(_id) {
        this._id = _id;
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

    function _id(i) {
        return i._id;
    }

    function _order(stack) {
        var ostack = _.sortBy(stack.stack, _ordered);
        //      console.log('ordered stack: ', Stack.prototype.toString.call({stack: ostack}));
        stack.ordered = _.map(ostack, _item);
        //    console.log('ordered stack ids: ', _.map(stack.ordered, _id).join(','));
    }

    function _item(i) {
        return i.item;
    }

    function _reverse(stack) {
        if (null === stack.ordered) {
            _order(stack);
        }
        stack.reversed = stack.ordered.reverse();
        //       console.log('reversed stack ids: ', _.map(stack.reversed, _id).join(','));
    }

    Stack.prototype = {

        toString:function () {
            var out = [];
            this.items().forEach(function (s) {
             //   console.log("foreach stack: ", s);
                out.push(s.toString());
            });

            return out.join("\n");
        },

        min_index:function () {
            if (!this.stack.length) {
                return 0;
            }
            var min = this.stack[0].index;
            this.stack.forEach(function (si) {
                min = Math.min(si.index, min);
            })
            return min;
        },

        max_index:function () {
            if (!this.stack.length) {
                return 0;
            }
            var max = this.stack[0].index;
            this.stack.forEach(function (si) {
                max = Math.max(si.index, max);
            })
            return max;
        },

        add:function (item, index) {
            if (!item) {
                throw new Error('Attempt to add nothing');
            }

            var id;
            if (item._id) {
                id = item._id;
            } else if (!(id = item.get('_id'))){
                throw new Error('Attempt to add unidd item');
            }

            if (arguments.length < 2) {
                index = this.max_index() + 1;
            }
            this.stack.push({item:item, index:index});

            if (this._on_add) {
                this._on_add();
            }
        },

        get:function (id) {
            for (var i = 0; i < this.stack.length; ++i) {
                if (this.stack[i].item.get('_id') == id) {
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