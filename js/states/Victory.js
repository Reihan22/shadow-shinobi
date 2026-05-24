NS.Victory = function (game) {};

NS.Victory.prototype = {
  create: function () {
    this.game.stage.backgroundColor = '#0a0a2e';
    var titleStyle = { font: '42px monospace', fill: '#FFD700' };
    this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 80,
      'VICTORY!',
      titleStyle
    ).anchor.set(0.5);
    var subStyle = { font: '18px monospace', fill: '#ffffff' };
    this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 20,
      'The shadow shinobi has conquered all!',
      subStyle
    ).anchor.set(0.5);
    var btnStyle = { font: '20px monospace', fill: '#e63946' };
    this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + 50,
      'PLAY AGAIN',
      btnStyle
    ).anchor.set(0.5);
    this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER)
      .onDown.addOnce(this.restart, this);
    this.game.input.onDown.addOnce(this.restart, this);
  },
  restart: function () {
    this.game.state.start('MainMenu');
  }
};
