
flowgraph.test = function(){

    function test_suite(){

        module('stack', {
            setup: function (){
                this.stack = new flowgraph.Stack('test_stack');
                this.stack.add({name: 'alpha0'}, 0);
                this.stack.add({name: 'gamma2'}, 2);
                this.stack.add({name: 'beta1'}, 1);
                console.log('stack: ', this.stack.toString());
                console.log('items: ', this.stack.items());
                console.log('items reveresed: ', this.stack.items(true));
            }
        });

        test('stack items', function(){
            equal(this.stack.items().length, 3, 'three items in stack');
            equal(this.stack.items(true).length, 3, 'three items in reverse');
            equal(this.stack.items()[0].name, 'alpha0', 'first item is alpha0');
            equal(this.stack.items()[2].name, 'gamma2', 'first item is gamma2');
        })
    }

    return test_suite;

} ()