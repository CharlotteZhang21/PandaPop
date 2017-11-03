import * as Util from '../utils/util';

class Bubble extends Phaser.Sprite {

    //initialization code in the constructor
    constructor(game, x, y, key, frame, scale) {

        super(game, x, y, key, frame);

        this.scale.x = scale;
        this.scale.y = scale;

        this.anchor.setTo(0.5, 0.5);

        this.game.physics.enable([this], Phaser.Physics.ARCADE);

        this.body.collideWorldBounds = true;
        this.body.immovable = true;
        this.body.moves = false;

        this.properties = {
            color: PiecSettings.bubbles[frame].color
        };

        var radius = this.width / 2;

        this.body.setCircle(
            radius,
            (-radius + 0.5 * this.width / this.scale.x),
            (-radius + 0.5 * this.height / this.scale.y)
        );
    }

    createPositionSlots() {

        var x = this.x + this.parent.x;
        var y = this.y + this.parent.y;

        var width = this.width;
        var halfWidth = this.width * 0.5;
        var height = Math.sqrt((width * width) - (halfWidth * halfWidth)); //pythagoras

        this.properties.positionSlots = [];


        //todo: restrict these
        var hasLeft = this.properties.x > 0;
        var hasRight = this.properties.x < xMax;

        var isOdd = this.properties.y % 2 !== 0;

        var inc = isOdd ? 0 : -1;

        var xMax = this.game.global.level.width - 1 + (isOdd ? -1 : 0);
        var xMin = (isOdd ? -1 : 0);

        if (this.properties.x <= xMax) {
            // right
            this.properties.positionSlots.push({
                xPos: x + width,
                yPos: y,
                x: this.properties.x + 1,
                y: this.properties.y,
                type: 'r',
                properties: this.properties
            });
        }
        if (this.properties.x <= xMax && this.properties.y !== 0) {
            // right up
            this.properties.positionSlots.push({
                xPos: x + halfWidth,
                yPos: y - height,
                x: this.properties.x + 1 + inc,
                y: this.properties.y - 1,
                type: 'ru',
                properties: this.properties
            });
        }
        if (this.properties.x <= xMax) {
            // right down
            this.properties.positionSlots.push({
                xPos: x + halfWidth,
                yPos: y + height,
                x: this.properties.x + 1 + inc,
                y: this.properties.y + 1,
                type: 'rd',
                properties: this.properties
            });
        }
        if (this.properties.x > xMin) {
            // left
            this.properties.positionSlots.push({
                xPos: x - width,
                yPos: y,
                x: this.properties.x - 1,
                y: this.properties.y,
                type: 'l',
                properties: this.properties
            });
        }
        if (this.properties.x > xMin && this.properties.y !== 0) {
            // left up
            this.properties.positionSlots.push({
                xPos: x - halfWidth,
                yPos: y - height,
                x: this.properties.x + inc,
                y: this.properties.y - 1,
                type: 'lu',
                properties: this.properties
            });
        }
        if (this.properties.x > xMin) {
            // left down
            this.properties.positionSlots.push({
                xPos: x - halfWidth,
                yPos: y + height,
                x: this.properties.x + inc,
                y: this.properties.y + 1,
                type: 'ld',
                properties: this.properties
            });
        }

    }

    displayPositionSlots() {

        this.properties.positionSlots.forEach(function(ps) {

            this.drawPositionSlot(ps.xPos, ps.yPos);

        }, this);
    }

    drawPositionSlot(x, y) {

        var dotSize = 5;

        var graphics = this.game.add.graphics(x, y);

        graphics.lineStyle(1, 0x222222, 1);

        graphics.beginFill(0xFF0000, 1);
        graphics.drawCircle(0, 0, dotSize);
    }

    getClosestPositionSlot(x, y) {

        var closestPositionSlot;

        var closestDist = null;

        var dist, xDelta, yDelta;

        this.properties.positionSlots.forEach(function(ps) {

            xDelta = x - ps.xPos;
            yDelta = y - ps.yPos;

            dist = Math.sqrt((xDelta * xDelta) + (yDelta * yDelta));

            if (closestDist == null || dist < closestDist) {

                closestDist = dist;
                closestPositionSlot = ps;
            }

        }, this);

        return closestPositionSlot;
    }

    setRandomColor(force) {

        var colorsRemaining = this.game.state.states.endcard.bubbles.getColorsRemaining();

        if (colorsRemaining.indexOf(this.frame) === -1 || force === true) {

            this.frame = Util.sample(colorsRemaining);

            this.properties.color = PiecSettings.bubbles[this.frame].color;
        }
    }

    pop(delay) {

        if (!this.game) {
            return;
        }

        this.createScoreText();

        this.game.time.events.add(delay || 0, function() {

            Util.playAnimation(this, 'bubble-pop');

            this.destroy();

        }, this);

    }

    createScoreText(group) {

        var game = this.game;

        var fontSize = 4.5 * window.devicePixelRatio;

        fontSize *= this.game.el.offsetWidth / (window.innerWidth);

        var score = new Phaser.Text(
            this.game,
            this.x + this.parent.x,
            this.y + this.parent.y,
            '10', {
                font: fontSize + "vw banzai",
                fill: PiecSettings.bubbles[this.frame].hexColor,
                stroke: '#151515',
                strokeThickness: 5,
                wordWrap: true
            });

        score.anchor.setTo(0.5, 0.5);

        if (!group) {
            this.game.add.existing(score);
        } else {
            group.add(score);
        }

        score.alpha = 0;

        this.game.time.events.add(500, function() {
            score.alpha = 1;
        }, this);

        var tween1 = game.add.tween(score.scale).from({
                x: 1.5,
                y: 1.5
            },
            250,
            Phaser.Easing.Quadratic.Out,
            true,
            500);

        var tween2 = game.add.tween(score).to({
                y: score.y - score.width
            },
            1250,
            Phaser.Easing.Linear.None,
            true,
            750);

        tween1.onComplete.add(function() {

            score.alpha = 1;

            var tween3 = game.add.tween(score).to({
                    alpha: 0
                },
                1000,
                Phaser.Easing.Linear.None,
                true,
                500);

        }, this);



        // var tween3 = this.game.add.tween(score).to({
        //         alpha: 0
        //     },
        //     1500,
        //     Phaser.Easing.Linear.None,
        //     true,
        //     500);
    }


    update() {

        // if (typeof this.properties.x !== 'undefined' &&
        //     typeof this.properties.y !== 'undefined' &&
        //     this.y > 600) {

        //     this.pop();

        // }


        if (this.worldPosition.y <= this.width &&
            (this.body.velocity.y > 0 || this.body.velocity.x > 0)) {


            var game = this.game.state.states.endcard.game;

            // hit ceiling!

            // stop bubble
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.immovable = true;
            this.body.moves = false;

            var xUnit = game.state.states.endcard.bubbles.bubbleWidth * this.scale.x * 1.5;

            var closest = Math.round((this.worldPosition.x - game.state.states.endcard.bubbles.x) / xUnit);

            var ps = {
                xPos: closest * xUnit,
                yPos: 0
            };

            var bubble = new Bubble(
                game,
                ps.xPos,
                ps.yPos,
                'bubbles',
                this.frame,
                this.scale.x);

            game.state.states.endcard.bubbles.add(bubble);

            bubble.properties.x = closest;
            bubble.properties.y = 0;

            bubble.createPositionSlots();

            var stats = game.state.states.endcard.bubbles.popBubbles(bubble, this.properties.color);

            // reset bubble and randomize color
            this.x = 0;
            this.y = 0;

            this.setRandomColor(true);

            game.state.states.endcard.bubbles.dropBubbles(stats.maxIndex * PiecSettings.bubblePopDelay, function(droppedTotal) {

                game.global.moveStats.bubblesDestroyed = droppedTotal + stats.destroyed;
                game.global.moveStats.totalBubblesDestroyed = game.global.moveStats.totalBubblesDestroyed || 0;
                game.global.moveStats.totalBubblesDestroyed += game.global.moveStats.bubblesDestroyed;

                var extraDelay = droppedTotal > 0 ? 1000 : 0;

                game.time.events.add(extraDelay + (stats.maxIndex * PiecSettings.bubblePopDelay), function() {

                    game.onMoveEnd.dispatch();
                });
            });
        }
    }

}

export default Bubble;
