import * as Util from '../utils/util';

class Character extends Phaser.Sprite {

    //initialization code in the constructor
    constructor(game, x, y, key, frame, scale) {

        super(game, x, y, key, 0);

        this.scale.x = scale;
        this.scale.y = scale;

        this.anchor.setTo(0.46, 0.75);

        // this.inputEnabled = true;

        // this.input.useHandCursor = true;

        // this.events.onInputDown.add(this.onDown, this);
    }

}

export default Character;