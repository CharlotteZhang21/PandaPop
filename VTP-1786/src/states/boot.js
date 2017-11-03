import * as Level1 from '../levels/1';
import * as Level2 from '../levels/2';
import * as Level3 from '../levels/3';
import * as Level4 from '../levels/4';
import * as Level5 from '../levels/5';

class Boot extends Phaser.State {

    constructor() {
        super();
    }

    preload() {}

    init() {

        // setup path for asset folder depending on environment
        PiecSettings.assetsDir = PiecSettings.env === 'dev' ? 'assets/' : '';

        var game = this.game;

        // custom game events here        
        game.onMoveStart = new Phaser.Signal(); // generic event hook
        game.onMoveEnd = new Phaser.Signal(); // generic event hook
        game.onGameWin = new Phaser.Signal(); // generic event hook
        game.onGameLose = new Phaser.Signal(); // generic event hook

        if (typeof piec !== 'undefined') {
            // public API methods
            piec.lockGame = function() {

                game.global.locked = true;
            };

            piec.unlockGame = function() {

                game.global.locked = false;
            };

            piec.restartLevel = function() {

                game.state.start(game.state.current);

                piec.unlockGame();
            };

            piec.winLevel = function() {

                game.onGameWin.dispatch();
            };

            piec.loseLevel = function() {

                game.onGameLose.dispatch();
            };

            piec.destroyGame = function() {

                game.destroy();
            };

            piec.setEnergyLevel = function(percent) {

                game.state.states.endcard.energyBar.setEnergy(percent);
            };
        }

        // stretch game to fit window
        window.onresize = function() {

            game.state.start('endcard');
        };
    }

    create() {

        this.init();

        this.game.input.maxPointers = 1;

        this.initGlobalVariables();

        this.setLevel();

        this.disableScroll();

        this.game.state.start('preloader');
    }

    setLevel() {

        switch (PiecSettings.level || 1) {
            case 1:
                this.game.global.level = Level1.default;
                break;
            case 2:
                this.game.global.level = Level2.default;
                break;
            case 3:
                this.game.global.level = Level3.default;
                break;
            case 4:
                this.game.global.level = Level4.default;
                break;
            case 5:
                this.game.global.level = Level5.default;
                break;
        }
    }

    initGlobalVariables() {
        this.game.global = {
            locked: false,
            started: false,
            userIntereacted: false
        };
    }

    preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', this.preventDefault, false);
        window.ontouchmove = this.preventDefault; // mobile
    }

    enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
        window.ontouchmove = null;
    }
}

export default Boot;
