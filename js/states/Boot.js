var NS = NS || {};

NS.Boot = function (game) {};

NS.Boot.prototype = {
  preload: function () {},
  create: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.parentIsWindow = false;
    this.game.scale.refresh();
    this.game.stage.backgroundColor = '#0a0a2e';
    this.game.state.start('Preloader');
  }
};
