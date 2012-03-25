(function () {
    function init_person_toolbar() {
        Ticker.addListener(window);

        function _new_person(target) {
            target.onClick = function (evt) {
                var p = new Person(_.shuffle(SCENER_CORE.sprite_sheets.people.getAnimations()).pop(),
                    Math.round(Math.random() * 10 - Math.random() * 10),
                    Math.round(Math.random() * 10 - Math.random() * 10)
                );
                SCENER_CORE.people_container.addChild(p);
                SCENER_CORE.mode = '';
                SCENER_CORE.update = true;
            }
        }

        var ani = new BitmapAnimation(SCENER_CORE.sprite_sheets.people);
        ani.gotoAndStop('female2');
        var s = new Shape(ani);
        s.x = (SCENER_CORE.sprites.BUTTON.W - ani.spriteSheet._frameWidth) * 1.5;
        s.y = (SCENER_CORE.sprites.BUTTON.H - ani.spriteSheet._frameHeight) / 2;

        SCENER_CORE.add_toolbar_button(s, 1, _new_person);
        SCENER_CORE.update = true;

    }

    SCENER_CORE.on_inits.push(init_person_toolbar);
})()