import * as Util from '../utils/util';

class Line extends Phaser.Group {

    //initialization code in the constructor
    constructor(game, x, y, distant, color) {

        super(game);

        this.x = x;
        this.y = y;

        this.dist = Math.sqrt((x * x) + (y * y));

        this.dotSpacing = 0.03 * this.game.el.offsetWidth * window.devicePixelRatio;

        this.numDots = this.dist / this.dotSpacing * distant;

        this.color = color;

        for (var i = 0; i < this.numDots; i++) {

            this.createDot((i * this.dotSpacing));
            this.createMarkers((i * this.dotSpacing));
        }

        game.world.sendToBack(this);

        this.angle = -90;

        this.createMask();
    }

    updateAngle(angle) {

        // angle in degrees
        this.angle = angle;

        if (this.angle >= -20) {
            this.angle = -20;
        }

        if (this.angle <= -160) {
            this.angle = -160;
        }

        this.maskLine.angle = this.angle;

        this.maskLine.x = this.x;
        this.maskLine.y = this.y;
    }

    calcAngle(x, y) {

        // angle in degrees
        var angle = Math.atan2(y - this.y, x - this.x) * 180 / Math.PI;

        return angle;
    }

    getWallHitPos() {

        var isRight = this.angle < -90;

        var multiplier = isRight ? 1 : -1;

        var y = Math.tan((multiplier * this.angle / 180) * Math.PI) * this.x;

        y = this.y - y;

        if (y < 0) {
            return null;
        }

        if (isRight) {
            return {
                x: 0,
                y: y
            };
        }

        return {
            x: this.x * 2,
            y: y
        };
    }

    createDot(x) {

        var dotSize = 0.015 * this.game.el.offsetWidth * window.devicePixelRatio;

        var graphics = this.game.add.graphics(x, 0);

        graphics.lineStyle(1, 0x151515, 1);

        graphics.beginFill(this.color, 1);
        graphics.drawCircle(0, 0, dotSize);

        this.add(graphics);

        var travelTo = ((this.numDots + 0.75) * this.dotSpacing);

        var distance = travelTo - x;

        var speed = 0.00022 * this.game.el.offsetHeight;

        var time = distance / speed;

        var tween = this.game.add.tween(graphics).to({
            x: travelTo
        }, time, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(function() {
            graphics.destroy();

            this.createDot(this.dotSpacing * 0.5, 0);
        }, this);
    }

    createMarkers(x) {

        var bubbleSize = this.game.state.states.endcard.bubbles.children[0].width * 0.5;

        var graphics = this.game.add.graphics(x, 0);

        graphics.beginFill(0x00FF00, 0);
        graphics.drawCircle(0, 0, bubbleSize);

        this.add(graphics);

        graphics.distance = x;

        this.markers = this.markers || [];

        this.markers.push(graphics);
    }

    createMask() {

        if (this.maskLine) {
            return;
        }

        var bubbleSize = this.game.state.states.endcard.bubbles.children[0].width;

        //  A mask is a Graphics object
        this.maskLine = this.game.add.graphics(this.x, this.y);

        //  Shapes drawn to the Graphics object must be filled.
        this.maskLine.beginFill(0xffffff);

        //  Here we'll draw a rectangle for each group sprite
        this.maskLine.drawRect(-0.5 * this.dotSpacing, -0.5 * this.dotSpacing,
            this.dist,
            bubbleSize);

        this.mask = this.maskLine;

    }
}

export default Line;
