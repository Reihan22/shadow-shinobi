NS.GameOver = function (game) {};

NS.GameOver.prototype = {
  init: function (data) {
    this.finalScore = (data && data.score) || 0;
  },
  create: function () {
    var g = this.game;
    var cx = g.world.centerX, cy = g.world.centerY;

    // Dark overlay
    var overlay = g.add.bitmapData(960, 540);
    var grd = overlay.ctx.createRadialGradient(480, 270, 50, 480, 270, 500);
    grd.addColorStop(0, 'rgba(20,0,0,0.9)');
    grd.addColorStop(1, 'rgba(0,0,0,0.95)');
    overlay.ctx.fillStyle = grd;
    overlay.ctx.fillRect(0, 0, 960, 540);
    g.add.image(0, 0, overlay);

    // Blood splatter effect
    var splatter = g.add.graphics(cx, cy - 80);
    splatter.beginFill(0x8B0000, 0.3);
    for (var i = 0; i < 8; i++) {
      var angle = Math.random() * Math.PI * 2;
      var dist = 30 + Math.random() * 80;
      var size = 5 + Math.random() * 15;
      splatter.drawCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, size);
    }
    splatter.endFill();

    // Title
    var title = g.add.text(cx, cy - 80, 'GAME OVER', {
      font: '72px monospace', fill: '#e63946', stroke: '#1a0000', strokeThickness: 6
    });
    title.anchor.set(0.5);
    title.setShadow(0, 0, 'rgba(230,57,70,0.5)', 25);

    // Score display
    var scoreText = g.add.text(cx, cy, 'Score: ' + this.finalScore, {
      font: 'bold 24px monospace', fill: '#FFD700'
    });
    scoreText.anchor.set(0.5);
    scoreText.alpha = 0;
    g.add.tween(scoreText).to({ alpha: 1 }, 1000, null, true, 500);

    // Subtitle
    var sub = g.add.text(cx, cy + 40, 'The shadow falls...', {
      font: '18px monospace', fill: '#8b949e'
    });
    sub.anchor.set(0.5);
    sub.alpha = 0;
    g.add.tween(sub).to({ alpha: 1 }, 1500, null, true, 800);

    // Restart prompt
    var restart = g.add.text(cx, cy + 80, 'Press ENTER to Try Again', {
      font: '18px monospace', fill: '#ffffff'
    });
    restart.anchor.set(0.5);
    g.add.tween(restart).to({ alpha: [0.3, 1] }, 1000, null, true, 0, -1);

    // Menu prompt
    var menu = g.add.text(cx, cy + 110, 'Press ESC for Menu', {
      font: '14px monospace', fill: '#484f58'
    });
    menu.anchor.set(0.5);

    g.input.keyboard.addKey(Phaser.KeyCode.ENTER)
      .onDown.addOnce(function () { g.state.start('Game'); });
    g.input.keyboard.addKey(Phaser.KeyCode.ESC)
      .onDown.addOnce(function () { g.state.start('MainMenu'); });
    g.input.onDown.addOnce(function () { g.state.start('Game'); });
  }
};
