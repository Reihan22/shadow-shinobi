window.onload = function () {
  window.game = new Phaser.Game(960, 540, Phaser.AUTO, 'game');
  game.state.add('Boot', NS.Boot);
  game.state.add('Preloader', NS.Preloader);
  game.state.add('MainMenu', NS.MainMenu);
  game.state.add('Game', NS.Game);
  game.state.add('GameOver', NS.GameOver);
  game.state.add('Victory', NS.Victory);
  game.state.start('Boot');
};
