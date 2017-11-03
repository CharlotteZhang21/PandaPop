import Bubble from '../prefabs/bubble';
import Character from '../prefabs/character';
import ReflectingLines from '../prefabs/reflecting-lines';
import * as Util from '../utils/util';

class BubbleCannon extends Phaser.Group {

    //initialization code in the constructor
    constructor(game, properties) {

        super(game);

        this.properties = properties;


        var bubbleCannonEl = document.getElementById('bubble-cannon');

        this.x =
            ((bubbleCannonEl.offsetLeft - this.game.el.offsetLeft) + (bubbleCannonEl.offsetWidth * 0.5)) * window.devicePixelRatio;
        this.y =
            ((bubbleCannonEl.offsetTop - this.game.el.offsetTop) + (bubbleCannonEl.offsetHeight * 0.5)) * window.devicePixelRatio;

        //define you region
        this.clickArea = new Phaser.Rectangle(
            0,
            0,
            game.width * window.devicePixelRatio,
            this.y);
        //listen for pointers
        // game.input.onDown.add(this.handlePointerDown, this);
        game.input.onUp.add(this.handlePointerUp, this);
        //handle a touch/click

        this.createBubbleBoxGroup();
        this.createCharacter();
        this.createBubble();
    }

    emitBubbles() {

        this.emitter = new Phaser.Particles.Arcade.Emitter(this.game, 0, 0, 20);

        this.emitter.makeParticles('bubbles', [0, 1, 2, 3, 4, 5], 20);

        this.emitter.minParticleSpeed.setTo(-200 * window.devicePixelRatio, -300 * window.devicePixelRatio);
        this.emitter.maxParticleSpeed.setTo(200 * window.devicePixelRatio, -800 * window.devicePixelRatio);
        this.emitter.minParticleScale = this.bubble.scale.x;
        this.emitter.maxParticleScale = this.bubble.scale.x;
        this.emitter.gravity = 150;

        this.emitter.start(false, 800, 100);

        this.bubbleBoxGroup.add(this.emitter);
    }

    createBubbleBoxGroup() {

        this.bubbleBoxGroup = new Phaser.Group(this.game);

        this.add(this.bubbleBoxGroup);

        this.createBubbleBox();
        this.createNextBubble();
        this.createBubbleCounter();

        this.bubbleBoxGroup.x = this.bubbleBox.width * -1;
        this.bubbleBoxGroup.y = this.bubbleBox.width * 0.15;

        this.nextBubble.sendToBack();
    }

    createBubbleCounter() {

        this.game.global.numberOfBubbles = PiecSettings.numberOfBubbles;

        var fontSize = 7.5;

        fontSize *= this.game.el.offsetWidth / (window.innerWidth);

        this.bubblCounter = new Phaser.Text(
            this.game,
            this.bubbleBox.width * 0.3,
            this.bubbleBox.width * -0.075,
            this.game.global.numberOfBubbles, {
                font: fontSize + "vw banzai",
                fill: "#FFFFFF",
                wordWrap: true
            });

        this.bubblCounter.anchor.setTo(0.5, 0.5);

        this.game.add.existing(this.bubblCounter);

        this.bubbleBoxGroup.add(this.bubblCounter);
    }

    updateBubbleCount() {

        this.bubblCounter.setText(this.game.global.numberOfBubbles);
    }

    createCharacter() {

        this.character = new Character(
            this.game,
            0,
            0,
            'throw',
            0,
            this.properties.bubbleScale * 5);

        this.add(this.character);

        this.character.animations.add('throw');
    }

    createSad() {

        this.sad = new Character(
            this.game,
            0,
            0,
            'lose',
            0,
            this.properties.bubbleScale * 4);

        this.add(this.sad);

        this.sad.animations.add('lose');

        var anim = this.sad.animations.play('lose', 30, false);

        this.sad.anchor.setTo(0.4, 0.6);
    }

    createHappy() {

        this.happy = new Character(
            this.game,
            0,
            0,
            'win',
            0,
            this.properties.bubbleScale * 5);

        this.add(this.happy);

        this.happy.animations.add('win');

        var anim = this.happy.animations.play('win', 30, false);

        this.happy.anchor.setTo(0.45, 0.75);
    }


    createBubbleBox() {

        this.bubbleBox = this.game.add.sprite(0, 0, 'bubble-box');

        this.bubbleBoxGroup.add(this.bubbleBox);

        this.bubbleBox.scale.x = this.properties.bubbleScale * 3;
        this.bubbleBox.scale.y = this.properties.bubbleScale * 3;

        this.bubbleBox.anchor.setTo(0.5, 0.5);

        this.bubbleBox.inputEnabled = true;

        this.bubbleBox.input.useHandCursor = true;

        this.bubbleBox.events.onInputDown.add(this.swapBubbles, this);
    }

    swapBubbles() {

        var frame = this.nextBubble.frame;
        var color = this.nextBubble.properties.color;

        this.nextBubble.frame = this.bubble.frame;
        this.nextBubble.properties.color = this.bubble.properties.color;

        this.bubble.frame = frame;
        this.bubble.properties.color = color;
    }

    createNextBubble() {

        this.nextBubble = new Bubble(
            this.game,
            this.bubbleBox.width * -0.065,
            this.bubbleBox.width * -0.20,
            'bubbles',
            0,
            this.properties.bubbleScale);

        this.nextBubble.setRandomColor(true);

        this.bubbleBoxGroup.add(this.nextBubble);

        this.nextBubble.anchor.setTo(0.5, 0.5);
    }

    handlePointerUp(pointer) {

        if (this.game.global.locked === true) {
            return;
        }

        if (this.line && this.isDown === true) {

            this.isDown = false;

            this.fire(this.line.primaryLine.angle);

            this.line.primaryLine.destroy(true);
            this.line.secondaryLine.destroy(true);
            this.line.destroy(true);

            this.aimerLineCreated = false;
        }
    }

    handlePointerDown() {


        if (this.game.global.locked === true ||
            this.game.input.activePointer.isDown === false ||
            this.game.global.started === false) {

            return;
        }
        
        this.game.global.userIntereacted = true;

        if (this.isWithinClickArea(this.game.input.activePointer) &&
            this.aimerLineCreated !== true) {

            this.isDown = true;
            this.aimerLineCreated = true;

            this.line = new ReflectingLines(
                this.game,
                this.x,
                this.y,
                PiecSettings.bubbles[this.bubble.frame].lineColor);

            this.game.world.bringToTop(this.line.primaryLine);
            this.game.world.bringToTop(this.bubble);
        }
    }

    isWithinClickArea(pointer) {
        return this.clickArea.contains(pointer.x, pointer.y);
    }

    createBubble() {

        this.bubble = new Bubble(
            this.game,
            0,
            0,
            'bubbles',
            0,
            this.properties.bubbleScale);

        this.bubble.setRandomColor(true);

        this.add(this.bubble);

        this.game.physics.enable([this.bubble], Phaser.Physics.ARCADE);

        this.bubble.body.allowGravity = false;
        this.bubble.body.bounce.x = 1;
        this.bubble.body.bounce.y = 1;
        this.bubble.body.collideWorldBounds = true;
        this.bubble.body.immovable = true;
        this.bubble.body.moves = false;
        this.bubble.body.velocity.x = 0;
        this.bubble.body.velocity.y = 0;
    }

    fire(angle) {

        this.game.onMoveStart.dispatch();

        this.game.time.events.add(50, function() {

            var speedFactor = 0.0025 * this.game.el.offsetHeight;

            var speed = speedFactor * PiecSettings.bubbleLaunchSpeed;

            var velocityX = Math.cos(angle * Math.PI / 180) * speed;
            var velocityY = Math.sin(angle * Math.PI / 180) * speed;

            this.bubble.body.immovable = false;
            this.bubble.body.moves = true;

            this.bubble.body.velocity.x = velocityX;
            this.bubble.body.velocity.y = velocityY;

            // this.bubble.body.allowGravity = true;

        }, this);

        var anim = this.character.animations.play('throw', 30, false);

        anim.onComplete.add(function(character) {

            character.frame = 0;

        }, this);
    }
}

export default BubbleCannon;
