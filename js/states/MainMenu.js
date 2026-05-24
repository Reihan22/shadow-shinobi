NS.MainMenu = function (game) {};

NS.MainMenu.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#0a0a2e';
    var titleStyle = { font: '48px monospace', fill: '#e63946' };
    var title = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 80,
      'SHADOW SHINOBI',
      titleStyle
    );
    title.anchor.set(0.5);
    var subStyle = { font: '20px monospace', fill: '#ffffff' };
    var sub = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 20,
      'Press ENTER or click to start',
      subStyle
    );
    sub.anchor.set(0.5);
    this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER)
      .onDown.addOnce(this.startGame, this);
    this.game.input.onDown.addOnce(this.startGame, this);
  },
  startGame: function () {
    this.game.state.start('Game');
  }
};
