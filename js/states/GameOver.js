NS.GameOver = function (game) {};

NS.GameOver.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#0a0a2e';
    var titleStyle = { font: '48px monospace', fill: '#e63946' };
    this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 60,
      'GAME OVER',
      titleStyle
    ).anchor.set(0.5);
    var subStyle = { font: '20px monospace', fill: '#ffffff' };
    this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + 10,
      'Press ENTER or click to retry',
      subStyle
    ).anchor.set(0.5);
    this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER)
      .onDown.addOnce(this.retry, this);
    this.game.input.onDown.addOnce(this.retry, this);
  },
  retry: function () {
    this.game.state.start('Game', true, false, { level: 1 });
  }
};
