 import Boot from './states/boot';
 import Endcard from './states/endcard';
 import Preloader from './states/preloader';

 var gameEl = document.getElementById('game');

 const game = new Phaser.Game(
     gameEl.offsetWidth * window.devicePixelRatio,
     gameEl.offsetHeight * window.devicePixelRatio,
     Phaser.CANVAS,
     'game',
     null,
     true);

 game.el = gameEl;

 game.state.add('boot', new Boot());
 game.state.add('endcard', new Endcard());
 game.state.add('preloader', new Preloader());

 game.state.start('boot');
