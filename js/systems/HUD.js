var NS = NS || {};

NS.HUD = {
  create: function (gameState) {
    var game = gameState.game;
    var y = 10;
    gameState.hud = game.add.group();
    gameState.hud.fixedToCamera = true;
    var coinIcon = game.make.image(10, y, 'coin_icon');
    gameState.coinText = game.make.text(36, y + 2, 'x0', {
      font: '16px monospace', fill: '#FFD700'
    });
    gameState.keyIcon = game.make.image(120, y, 'key_icon');
    var livesX = 170;
    gameState.heartIcons = [];
    for (var i = 0; i < 3; i++) {
      var heart = game.make.image(livesX + i * 26, y, 'heart_icon');
      gameState.heartIcons.push(heart);
      gameState.hud.add(heart);
    }
    var starIcon = game.make.image(game.camera.width - 80, y, 'star_icon');
    gameState.starText = game.make.text(game.camera.width - 54, y + 2, 'x0', {
      font: '16px monospace', fill: '#FFD700'
    });
    gameState.hud.add(coinIcon);
    gameState.hud.add(gameState.coinText);
    gameState.hud.add(gameState.keyIcon);
    gameState.hud.add(starIcon);
    gameState.hud.add(gameState.starText);
  },
  update: function (gameState) {
    gameState.coinText.setText('x' + gameState.coinCount);
    gameState.starText.setText('x' + gameState.starCount);
    gameState.keyIcon.loadTexture(gameState.hasKey ? 'key_icon_lit' : 'key_icon');
    for (var i = 0; i < 3; i++) {
      if (gameState.heartIcons[i]) {
        gameState.heartIcons[i].visible = (i < gameState.lives);
      }
    }
  }
};
