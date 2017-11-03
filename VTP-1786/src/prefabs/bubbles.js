import Bubble from '../prefabs/bubble';
import * as Util from '../utils/util';

class Bubbles extends Phaser.Group {

    //initialization code in the constructor
    constructor(game) {

        super(game);

        this.createSettings();
        this.setPosition();
        this.createBubbles();

        this.game.global.moveStats = {
            totalBubbles: this.children.length
        };
    }

    createSettings() {

        var widthRatio = (21 / 32);
        var heightRatio = (56 / 32);

        this.tilemapData = this.game.global.level;

        this.tileWidth = this.tilemapData.tilesets[0].tilewidth;
        this.tileHeight = this.tilemapData.tilesets[0].tileheight;

        this.bubbleWidth = this.tileWidth * widthRatio;
        this.bubbleHeight = this.tileHeight * heightRatio;

        this.gridSizeX = this.tilemapData.layers[0].width;
        this.gridSizeY = this.tilemapData.layers[0].height;

        this.game.global.possibleColors = [];
    }

    createBubbles() {

        var bubbleX, bubbleY, bubble, index, frame, color;

        for (var i = 0; i < this.gridSizeX; i++) {
            for (var j = 0; j < this.gridSizeY; j++) {

                if (this.gridSizeX % 2 === 0 || i + 1 <= this.gridSizeX || j % 2 === 0) {

                    index = (j * this.gridSizeX) + i;

                    frame = this.tilemapData.layers[0].data[index] - 1;

                    if (frame < 0) {
                        continue;
                    }

                    bubbleX = this.bubbleWidth * i * 1.5 + (this.bubbleWidth / 4 * 3) * (j % 2);
                    bubbleY = this.bubbleHeight * j / 2;

                    this.createBubble(
                        i,
                        j,
                        bubbleX * this.bubbleScale,
                        bubbleY * this.bubbleScale,
                        frame);

                    this.game.global.possibleColors = Util.uniq(this.game.global.possibleColors);

                }
            }
        }
    }

    getUnitX(i) {
        return this.bubbleWidth * i * 1.5 + (this.bubbleWidth / 4 * 3);
    }

    createBubble(x, y, xPos, yPos, frame) {

        var bubble = new Bubble(
            this.game,
            xPos,
            yPos,
            'bubbles',
            frame,
            this.bubbleScale);

        var color = PiecSettings.bubbles[frame].color;

        this.add(bubble);

        bubble.properties.x = x;
        bubble.properties.y = y;

        bubble.createPositionSlots();
        // bubble.displayPositionSlots();

        this.game.global.possibleColors.push(color);
    }

    getBubblesWithPositionSlot(bubble) {

        var bubbles = [];

        var point;

        this.forEach(function(b) {

            b.properties.positionSlots.forEach(function(ps) {

                if (bubble.getBounds().contains(new Phaser.Point(ps.xPos, ps.yPos))) {

                    bubbles.push(b);
                }

            }, this);

        }, this);

        return bubbles;
    }

    getMatchingColors(bubble, color, index, matchingBubbles) {

        matchingBubbles = matchingBubbles || [];

        color = color || bubble.properties.color;

        index = index || 1;

        matchingBubbles.push({
            index: index,
            bubble: bubble
        });

        index++;

        var adjBubbles = this.getAdjacentBubbles(bubble);

        var contains;

        adjBubbles.forEach(function(b) {

            if (b.properties.color === color) {

                contains = false;

                matchingBubbles.forEach(function(mb) {

                    if (mb.bubble === b) {
                        contains = true;
                    }
                }, this);

                if (contains === false) {

                    this.getMatchingColors(b, color, index, matchingBubbles);
                }
            }
        }, this);

        return matchingBubbles;
    }

    getAdjacentBubbles(bubble) {

        var b;
        var adjBubbles = [];

        bubble.properties.positionSlots.forEach(function(ps) {

            b = this.getBubbleAt(ps.x, ps.y);

            if (b !== null) {
                adjBubbles.push(b);
            }

        }, this);

        return adjBubbles;
    }

    getBubbleAt(x, y) {

        var bubble = null;

        this.forEach(function(b) {

            if (b.properties.x === x && b.properties.y === y) {
                bubble = b;
            }

        }, this);

        return bubble;
    }

    getAnchorBubbles() {

        var bubbles = [];

        this.forEach(function(b) {

            if (b.y === 0) {

                bubbles.push(b);
            }

        }, this);

        return bubbles;
    }

    getConnected(bubble, connectedBubbles, setAnchored) {

        connectedBubbles = connectedBubbles || [];

        var adjBubbles;

        if (!(setAnchored === true && bubble.properties.anchored === true)) {

            connectedBubbles.push({
                x: bubble.properties.x,
                y: bubble.properties.y
            });

            adjBubbles = this.getAdjacentBubbles(bubble);
        } else {
            adjBubbles = [];
        }

        if (setAnchored === true) {
            bubble.properties.anchored = true;
        }

        var contains;

        adjBubbles.forEach(function(ab) {

            contains = false;

            connectedBubbles.forEach(function(b) {

                if (b.x === ab.properties.x &&
                    b.y === ab.properties.y) {
                    contains = true;
                }

            }, this);

            if (contains === false) {
                this.getConnected(ab, connectedBubbles, setAnchored);
            }

        }, this);

        return connectedBubbles;

    }

    unanchorAll() {

        this.forEach(function(b) {

            b.properties.anchored = false;

        }, this);

    }

    getFloating() {

        var floating = [];

        var anchorBubbles = this.getAnchorBubbles();

        var anchoredBubbles = [];

        this.unanchorAll();

        anchorBubbles.forEach(function(b) {

            anchoredBubbles = anchoredBubbles.concat(this.getConnected(b, [], true));
        }, this);

        var bubble;

        this.forEach(function(b) {

            if (b.properties.anchored === false) {

                floating.push(b);
            }
        }, this);

        return floating;
    }

    setPosition() {
        // pad maybe?
        // this.y = 100;
        // this.x = 100;

        var padPercent = 0.05;

        var windowWidth = this.game.el.offsetWidth * window.devicePixelRatio;

        var desiredWidth = windowWidth * (1 - padPercent);

        var pad = (windowWidth - desiredWidth);

        var currentWidth =
            (this.gridSizeX) * this.tileWidth * window.devicePixelRatio;

        var newScale = desiredWidth / currentWidth;

        this.bubbleScale = newScale * window.devicePixelRatio;

        this.x = pad;
        this.y = (pad * window.devicePixelRatio) + (this.game.el.offsetHeight * 0.11);
    }

    popBubbles(bubble, color) {

        var matchingBubbles = this.getMatchingColors(bubble, color);

        var maxIndex = 0;

        var destroyed = 0;

        if (matchingBubbles.length >= 3) {

            matchingBubbles.forEach(function(mb) {

                mb.bubble.pop(mb.index * PiecSettings.bubblePopDelay);

                if (maxIndex < mb.index) {
                    maxIndex = mb.index;
                }

                destroyed++;

            }, this);
        }

        return {
            maxIndex: maxIndex,
            destroyed: destroyed
        };
    }

    dropBubbles(delay, callback) {

        this.game.time.events.add(delay || 0, function() {

            var floating = this.getFloating();

            floating.forEach(function(f) {

                f.body.collideWorldBounds = false;
                f.body.immovable = false;
                f.body.moves = true;

                f.body.velocity.x = Util.rndInt(10, -10);

                this.game.time.events.add(Util.rndInt(1000, 600), function() {
                    f.pop();

                }, this);

            }, this);

            if (callback) {
                callback(floating.length);
            }

        }, this);
    }


    getColorsRemaining() {

        var colorsRemaining = [];

        this.forEach(function(b) {

            if (colorsRemaining.indexOf(b.properties.color) === -1) {

                colorsRemaining.push(b.properties.color);
            }
        }, this);

        var colorIndexes = [];

        colorsRemaining.forEach(function(c) {

            PiecSettings.bubbles.forEach(function(b, index) {

                if (b.color === c) {
                    colorIndexes.push(index);
                }
            }, this);

        }, this);

        return colorIndexes;
    }
}

export default Bubbles;
