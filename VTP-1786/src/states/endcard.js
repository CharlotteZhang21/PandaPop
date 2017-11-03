import Bubble from '../prefabs/bubble';
import Bubbles from '../prefabs/bubbles';
import BubbleCannon from '../prefabs/bubble-cannon';
import EnergyBar from '../prefabs/energy-bar';
import * as Util from '../utils/util';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {

        this.resize();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //  Set the world (global) gravity
        this.game.physics.arcade.gravity.y = 500;

        //this.game.time.advancedTiming = true;

        this.bubbles = new Bubbles(this.game);
        this.bubbleCannon = new BubbleCannon(this.game, {
            bubbleScale: this.bubbles.bubbleScale * 1.
         });
        this.energyBar = new EnergyBar(this.game);

        this.createTutorial();
        this.initAutoStart();

        // when level starts drop any floating bubbles
        this.bubbles.dropBubbles();

        this.updateColorsBasedOnRemaning();

        // event handler
        this.game.onMoveStart.add(this.onMoveStart, this);
        this.game.onMoveEnd.add(this.onMoveEnd, this);
        this.game.onGameWin.add(this.onGameWin, this);
        this.game.onGameLose.add(this.onGameLose, this);
        this.game.input.onDown.add(this.onDown, this);
    }

    initAutoStart() {

        if (!PiecSettings.autoFireAfter) {
            return;
        }

        this.game.time.events.add(PiecSettings.autoFireAfter, function() {

            if (this.game.global.userIntereacted === false) {

                this.game.global.userIntereacted = true;

                this.onDown();

                this.bubbleCannon.fire(Util.rndInt(320, 220));
            }

        }, this);
    }

    resize() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.scale.setGameSize(
            this.game.el.offsetWidth * window.devicePixelRatio,
            this.game.el.offsetHeight * window.devicePixelRatio);

        this.game.world.setBounds(
            0,
            0,
            this.game.el.offsetWidth * window.devicePixelRatio,
            this.game.el.offsetHeight * window.devicePixelRatio);
    }

    onDown() {

        if (this.game.global.started !== true) {
            this.startGame();
        }
    }

    startGame() {

        this.game.global.starting = true;

        this.game.add.tween(this.tutorialArrow).to({
            alpha: 0
        }, 250, Phaser.Easing.Linear.None, true);

        this.game.add.tween(this.tutorialText).to({
            alpha: 0
        }, 250, Phaser.Easing.Linear.None, true);

        this.game.time.events.add(250, function() {

            this.game.global.starting = false;
            this.game.global.started = true;
        }, this);

        if (piec.onTutorialHide) {
            piec.onTutorialHide();
        }
    }

    createTutorial() {

        if (this.game.global.started === true) {
            return;
        }

        this.tutorialText = this.game.add.sprite(0, 0, 'tutorial-text');

        Util.positionSpriteInDomElement(this.tutorialText, 'tutorial-text');

        this.tutorialArrow = this.game.add.sprite(0, 0, 'tutorial-arrow');

        Util.positionSpriteInDomElement(this.tutorialArrow, 'tutorial-arrow');

        var tween = this.game.add.tween(this.tutorialArrow).to({
            y: this.tutorialArrow.y + (window.innerHeight * window.devicePixelRatio * 0.05)
        }, 1000, Phaser.Easing.Linear.None, true, 0, -1);

        //  And this tells it to yoyo, i.e. fade back to zero again before repeating.
        //  The 3000 tells it to wait for 3 seconds before starting the fade back.
        tween.yoyo(true, 0);
    }

    updateColorsBasedOnRemaning() {

        var colorsRemaining = this.bubbles.getColorsRemaining();

        if (colorsRemaining.indexOf(this.bubbleCannon.bubble.properties.color) === -1) {

            this.bubbleCannon.bubble.setRandomColor();
        }

        if (colorsRemaining.indexOf(this.bubbleCannon.nextBubble.properties.color) === -1) {

            this.bubbleCannon.nextBubble.setRandomColor();
        }
    }

    onMoveStart() {


        this.game.global.locked = true;

        this.game.global.numberOfBubbles--;

        this.game.time.events.add(250, function() {

            this.bubbleCannon.updateBubbleCount();
        }, this);


        if (typeof piec !== 'undefined' && piec.onMoveStart) {
            piec.onMoveStart(); // call out externally
        }
    }

    onMoveEnd() {

        this.game.global.moveStats.bubblesLeft = this.bubbles.children.length;

        if (this.bubbles.children.length === 0) {
            this.game.onGameWin.dispatch();
            return;
        }

        if (this.game.global.numberOfBubbles === 0) {
            this.game.onGameLose.dispatch();
            return;
        }

        this.game.global.locked = false;

        this.updateColorsBasedOnRemaning();

        if (typeof piec !== 'undefined' && piec.onMoveStart) {
            piec.onMoveEnd(this.game.global.moveStats); // call out externally
        }
    }

    onGameWin() {

        this.game.global.locked = true;

        if (typeof piec !== 'undefined' && piec.onMoveStart) {
            piec.onGameWin(); // call out externally
        }

        this.bubbleCannon.character.alpha = 0;
        this.bubbleCannon.bubble.alpha = 0;
        this.bubbleCannon.createHappy();
        this.bubbleCannon.emitBubbles();
    }

    onGameLose() {

        this.game.global.locked = true;

        if (typeof piec !== 'undefined' && piec.onMoveStart) {
            piec.onGameLose(); // call out externally
        }

        this.bubbleCannon.character.alpha = 0;
        this.bubbleCannon.bubble.alpha = 0;
        this.bubbleCannon.createSad();
    }

    update() {

        this.game.physics.arcade.collide(
            this.bubbleCannon.bubble,
            this.bubbles,
            this.collisionHandler,
            this.processHandler,
            this);

        this.bubbleCannon.handlePointerDown();

        if (this.bubbleCannon.emitter) {

            this.bubbleCannon.emitter.forEach(function(p) {

                if (p.alive === false) {

                    var b = new Bubble(
                        this.game,
                        p.x,
                        p.y,
                        'bubbles',
                        p.frame,
                        this.bubbles.bubbleScale);

                    this.bubbleCannon.bubbleBoxGroup.add(b);

                    b.createScoreText(this.bubbleCannon.bubbleBoxGroup);

                    Util.playAnimationForGroup(this.bubbleCannon.bubbleBoxGroup, b, 'bubble-pop');

                    b.destroy();

                    p.destroy();
                }
            }, this);
        }

    }

    processHandler() {

        return true;
    }

    collisionHandler(bubble1, bubble2) {

        if (bubble1.x === 0 && bubble1.y === 0) {
            return;
        }

        // stop bubble
        bubble1.body.velocity.x = 0;
        bubble1.body.velocity.y = 0;
        bubble1.body.immovable = true;
        bubble1.body.moves = false;

        var ps = bubble2.getClosestPositionSlot(
            bubble1.worldPosition.x,
            bubble1.worldPosition.y);

        var bubble = new Bubble(
            this.game,
            ps.xPos - this.bubbles.x,
            ps.yPos - this.bubbles.y,
            'bubbles',
            bubble1.frame,
            bubble1.scale.x);

        this.bubbles.add(bubble);

        bubble.properties.x = ps.x;
        bubble.properties.y = ps.y;

        bubble.createPositionSlots();

        var stats = this.bubbles.popBubbles(bubble, bubble1.properties.color);

        // reset bubble and randomize color
        bubble1.x = 0;
        bubble1.y = 0;

        bubble1.frame = this.bubbleCannon.nextBubble.frame;
        bubble1.properties.color = this.bubbleCannon.nextBubble.properties.color;

        this.bubbleCannon.nextBubble.setRandomColor(true);

        var _this = this;

        this.bubbles.dropBubbles(stats.maxIndex * PiecSettings.bubblePopDelay, function(droppedTotal) {

            _this.game.global.moveStats.bubblesDestroyed = droppedTotal + stats.destroyed;
            _this.game.global.moveStats.totalBubblesDestroyed = _this.game.global.moveStats.totalBubblesDestroyed || 0;
            _this.game.global.moveStats.totalBubblesDestroyed += _this.game.global.moveStats.bubblesDestroyed;

            var extraDelay = droppedTotal > 0 ? 1000 : 0;

            _this.game.time.events.add(extraDelay + (stats.maxIndex * PiecSettings.bubblePopDelay), function() {

                _this.game.onMoveEnd.dispatch();
            }, _this);

        });
    }
}

export default Endcard;
