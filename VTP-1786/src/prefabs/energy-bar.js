import * as Util from '../utils/util';

class EnergyBar extends Phaser.Group {

    //initialization code in the constructor
    constructor(game, settings) {

        super(game);

        var settings = {
            elId: 'energy-bar',
            starOffsetY: 0.4,
            star1: 0.26 - 0.5,
            star2: 0.56 - 0.5,
            star3: 0.83 - 0.5,
            energyX: -0.41,
            energyY: 0,
            energyMaxHeight: 0.7,
            energyMaxWidth: 0.8
        };

        this.settings = settings;

        this.createItem('empty-bar', 'empty-bar', 0, 0);
        this.createItem('energy', 'energy', settings.energyX, settings.energyY);
        this.createItem('empty-star1', 'empty-star', settings.star1, settings.starOffsetY);
        this.createItem('empty-star2', 'empty-star', settings.star2, settings.starOffsetY);
        this.createItem('empty-star3', 'empty-star', settings.star3, settings.starOffsetY);
        this.createItem('star1', 'star', settings.star1, settings.starOffsetY);
        this.createItem('star2', 'star', settings.star2, settings.starOffsetY);
        this.createItem('star3', 'star', settings.star3, settings.starOffsetY);

        this['energy'].anchor.setTo(0, 0.5);
        this['energy'].height = this['empty-bar'].height * settings.energyMaxHeight;

        this['star1'].alpha = 0;
        this['star2'].alpha = 0;
        this['star3'].alpha = 0;
    }

    setEnergy(percent) {

        if (percent > 1) {
            percent = 1;
        }

        var maxWidth = this['empty-bar'].width * this.settings.energyMaxWidth;

        this.game.add.tween(this['energy']).to({
                width: percent * maxWidth
            },
            400,
            Phaser.Easing.Linear.None,
            true);

        if (percent > 0.20) {
            this.game.add.tween(this['star1']).to({
                    alpha: 1
                },
                500,
                Phaser.Easing.Linear.None,
                true);
        }

        if (percent > 0.58) {
            this.game.add.tween(this['star2']).to({
                    alpha: 1
                },
                500,
                Phaser.Easing.Linear.None,
                true);
        }

        if (percent > 0.91) {
            this.game.add.tween(this['star3']).to({
                    alpha: 1
                },
                500,
                Phaser.Easing.Linear.None,
                true);
        }

    }

    createItem(name, key, xPos, yPos) {

        var w = this['empty-bar'] ? this['empty-bar'].width : 0;
        var h = this['empty-bar'] ? this['empty-bar'].height : 0;

        this[name] = new Phaser.Sprite(
            this.game,
            xPos * w,
            yPos * h,
            key);

        this.add(this[name]);

        Util.positionSpriteInDomElement(
            this[name],
            this.settings.elId);

        if (xPos || yPos) {

            this[name].x =
                (this['empty-bar'].x) + (xPos * this['empty-bar'].width);

            this[name].y =
                (this['empty-bar'].y) + (yPos * this['empty-bar'].height);
        }
    }

}

export default EnergyBar;
