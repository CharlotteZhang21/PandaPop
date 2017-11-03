import Line from '../prefabs/line';

class ReflectingLines extends Phaser.Group {

    //initialization code in the constructor
    constructor(game, x1, y1, color) {

        super(game);

        this.x1 = x1;
        this.y1 = y1;
        this.color = color;

        this.primaryLine = new Line(game, x1, y1, 1, color);
        this.secondaryLine = new Line(game, x1, y1, 0.2, color);

        this.secondaryLine.alpha = 0;
    }

    update() {

        this.primaryLine.updateAngle(
            this.primaryLine.calcAngle(
                this.game.input.activePointer.position.x,
                this.game.input.activePointer.position.y)
        );


        // if(this.primaryLine.angle < 0) {
        //     this.primaryLine.destroy();
        //     this.secondaryPos.destroy();
        // }

        this.secondaryPos = this.primaryLine.getWallHitPos();

        this.secondaryLine.alpha = 0;

        if (this.secondaryPos !== null) {

            this.secondaryLine.alpha = 1;
            this.secondaryLine.x = this.secondaryPos.x;
            this.secondaryLine.y = this.secondaryPos.y;

            this.secondaryLine.updateAngle((-90 - (this.primaryLine.angle + 90)));
        }

        if(this.getClip(this.primaryLine)) {
            this.secondaryLine.alpha = 0;
        } else {

            this.getClip(this.secondaryLine);
        }
    }

    getClip(line) {

        var bubbleSize = this.game.state.states.endcard.bubbles.children[0].width;

        var shortestDist;

        line.markers.forEach(function(m) {

            this.game.state.states.endcard.bubbles.forEach(function(b) {

                if(Phaser.Rectangle.intersects(m.getBounds(), b.getBounds())) {

                    shortestDist = shortestDist || m.distance;

                    if(m.distance < shortestDist) {
                        shortestDist = m.distance;
                    }
                }

            }, this);

        }, this);

        line.maskLine.width = shortestDist ? shortestDist + (bubbleSize * 0.5) : line.dist;

        return shortestDist;
    }

}

export default ReflectingLines;
