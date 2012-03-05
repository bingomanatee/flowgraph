
flowgraph.test = function(){

    function test_suite(){

        module('stack', {
            setup: function (){
                this.stack = new flowgraph.Stack('test_stack');
                this.stack.add({id: 'alpha0'});
                this.stack.add({id: 'beta1'});
                this.stack.add({id: 'gamma2'});
                console.log('stack: ', this.stack.toString());
                console.log('items: ', this.stack.items());
                console.log('items reveresed: ', this.stack.items(true));
            }
        });

        test('stack items', function(){
            equal(this.stack.items().length, 3, 'three items in stack');
            equal(this.stack.items(true).length, 3, 'three items in reverse');
            equal(this.stack.items()[0].id, 'gamma2', 'first item is gamma2');
            equal(this.stack.items().pop().id, 'alha0', 'third item is alpha0');
        })
    }

    return test_suite;

} ()