var NS = NS || {};

NS.HUD = {
  create: function (gameState) {
    var game = gameState.game;
    var y = 10;
    gameState.hud = game.add.group();
    gameState.hud.fixedToCamera = true;

    // Coin icon + count
    var coinIcon = game.make.image(10, y, 'coin_icon');
    gameState.coinText = game.make.text(36, y + 2, 'x0', {
      font: '16px monospace', fill: '#FFD700'
    });

    // Key icon
    gameState.keyIcon = game.make.image(120, y, 'key_icon');

    // Hearts
    var livesX = 160;
    gameState.heartIcons = [];
    for (var i = 0; i < 3; i++) {
      var heart = game.make.image(livesX + i * 26, y, 'heart_icon');
      gameState.heartIcons.push(heart);
      gameState.hud.add(heart);
    }

    // Star count (top right)
    var starIcon = game.make.image(game.camera.width - 80, y, 'star_icon');
    gameState.starText = game.make.text(game.camera.width - 54, y + 2, 'x0', {
      font: '16px monospace', fill: '#FFD700'
    });

    // Score (top right, below stars)
    gameState.scoreText = game.make.text(game.camera.width - 10, y + 28, '0', {
      font: 'bold 18px monospace', fill: '#ffffff',
      stroke: '#000', strokeThickness: 2
    });
    gameState.scoreText.anchor.set(1, 0);

    // Combo indicator (center top)
    gameState.comboText = game.make.text(game.camera.width / 2, y + 4, '', {
      font: 'bold 20px monospace', fill: '#ff4444',
      stroke: '#000', strokeThickness: 3
    });
    gameState.comboText.anchor.set(0.5, 0);
    gameState.comboText.alpha = 0;

    // Level timer (top center)
    gameState.timerText = game.make.text(game.camera.width / 2, y + 28, '0:00', {
      font: '12px monospace', fill: '#666666'
    });
    gameState.timerText.anchor.set(0.5, 0);

    // Add to HUD group
    gameState.hud.add(coinIcon);
    gameState.hud.add(gameState.coinText);
    gameState.hud.add(gameState.keyIcon);
    gameState.hud.add(starIcon);
    gameState.hud.add(gameState.starText);
    gameState.hud.add(gameState.scoreText);
    gameState.hud.add(gameState.comboText);
    gameState.hud.add(gameState.timerText);
  },

  update: function (gameState) {
    gameState.coinText.setText('x' + gameState.coinCount);
    gameState.starText.setText('x' + gameState.starCount);
    gameState.keyIcon.loadTexture(gameState.hasKey ? 'key_icon_lit' : 'key_icon');

    for (var i = 0; i < 3; i++) {
      if (gameState.heartIcons[i]) {
        gameState.hudIcons_visible = (i < gameState.lives);
        gameState.heartIcons[i].visible = (i < gameState.lives);
      }
    }

    // Score
    gameState.scoreText.setText(gameState.score || 0);

    // Combo display
    var now = gameState.game.time.now;
    if (gameState.comboCount > 1 && now - gameState.comboTimer < 2000) {
      gameState.comboText.setText('COMBO x' + Math.min(gameState.comboCount, 5));
      gameState.comboText.alpha = 1;
    } else {
      gameState.comboText.alpha *= 0.95; // fade out
      if (gameState.comboText.alpha < 0.05) gameState.comboText.alpha = 0;
    }

    // Timer
    var totalSec = Math.floor(gameState.levelTime || 0);
    var min = Math.floor(totalSec / 60);
    var sec = totalSec % 60;
    gameState.timerText.setText(min + ':' + (sec < 10 ? '0' : '') + sec);
  }
};
