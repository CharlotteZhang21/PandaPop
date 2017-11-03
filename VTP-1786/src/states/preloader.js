 import * as Lose from '../atlas/lose';
 import * as Throw from '../atlas/throw';
 import * as Win from '../atlas/win';
 import * as Util from '../utils/util';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.asset = null;
     }

     preload() {
         //setup loading bar
         // this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
         // this.load.setPreloadSprite(this.asset);

         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
     }

     update() {}

     loadResources() {

         //energy bar
         this.game.load.image('bubble-box', PiecSettings.assetsDir + 'bubble-box.png', 107, 84);
         this.game.load.image('empty-bar', PiecSettings.assetsDir + 'empty-bar.png');
         this.game.load.image('empty-star', PiecSettings.assetsDir + 'empty-star.png');
         this.game.load.image('energy', PiecSettings.assetsDir + 'energy.png');
         this.game.load.image('star', PiecSettings.assetsDir + 'star.png');
         this.game.load.image('tutorial-arrow', PiecSettings.assetsDir + 'tutorial-arrow.png');
         this.game.load.image('tutorial-text', PiecSettings.assetsDir + 'tutorial-text.png');

         this.game.load.spritesheet('bubbles', PiecSettings.assetsDir + 'bubbles.png', PiecSettings.bubbleFrameSize, PiecSettings.bubbleFrameSize);

         this.game.load.atlasJSONHash('throw', PiecSettings.assetsDir + 'throw.png', null, Throw.default);
         this.game.load.atlasJSONHash('lose', PiecSettings.assetsDir + 'lose.png', null, Lose.default);
         this.game.load.atlasJSONHash('win', PiecSettings.assetsDir + 'win.png', null, Win.default);

         // list of animations
         PiecSettings.animations = PiecSettings.animations || [];

         // important - add all your animations (see above) here to this array
         PiecSettings.animations.push({
             name: 'bubble-pop', // name of your animation
             img: 'bubble-pop.png', // the name of your png sequence image
             frames: 9, // number of frames the png sequence contains
             frameWidth: 99, // the width of each frame with the png sequence
             frameHeight: 100, // the height of each frame with the png sequence
             frameRate: 30, // the frame rate at which this animaiton should be played at
             scale: 1, // the scale of the animation (eg scale of 2 would make the animaiton twice as large)
             alpha: 1, // the opacity of the animation
             atlas: false // is atlas animation animation
         });

         PiecSettings.animations.forEach(function(a) {

             if (a.atlas === true) {

                 this.game.load.atlas(
                     a.name,
                     PiecSettings.assetsDir + a.img,
                     null,
                     this.atlasData[a.name]);

             } else {

                 this.game.load.spritesheet(
                     a.name,
                     PiecSettings.assetsDir + a.img,
                     a.frameWidth,
                     a.frameHeight,
                     a.frames);
             }
         }, this);

     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;
