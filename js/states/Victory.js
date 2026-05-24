NS.Victory = function (game) {};

NS.Victory.prototype = {
  create: function () {
    var g = this.game;
    var cx = g.world.centerX, cy = g.world.centerY;

    // Golden gradient background
    var bg = g.add.bitmapData(960, 540);
    var grd = bg.ctx.createRadialGradient(480, 270, 50, 480, 270, 500);
    grd.addColorStop(0, 'rgba(40,30,0,0.95)');
    grd.addColorStop(0.5, 'rgba(15,10,0,0.95)');
    grd.addColorStop(1, 'rgba(0,0,0,0.98)');
    bg.ctx.fillStyle = grd;
    bg.ctx.fillRect(0, 0, 960, 540);
    g.add.image(0, 0, bg);

    // Floating golden particles
    for (var i = 0; i < 30; i++) {
      var px = Math.random() * 960;
      var py = Math.random() * 540;
      var p = g.add.graphics(px, py);
      p.beginFill(0xFFD700, 0.3 + Math.random() * 0.5);
      var ps = 1 + Math.random() * 3;
      p.drawCircle(0, 0, ps);
      p.endFill();
      g.add.tween(p).to({
        y: py - 50 - Math.random() * 100,
        alpha: 0
      }, 3000 + Math.random() * 3000, null, true, Math.random() * 2000, -1, false);
    }

    // Title
    var title = g.add.text(cx, cy - 100, 'VICTORY', {
      font: '80px monospace', fill: '#FFD700', stroke: '#8B6914', strokeThickness: 6
    });
    title.anchor.set(0.5);
    title.setShadow(0, 0, 'rgba(255,215,0,0.5)', 30);

    // Subtitle
    var sub = g.add.text(cx, cy - 20, 'The Shadow Shinobi has restored honor', {
      font: '18px monospace', fill: '#C0C0C0'
    });
    sub.anchor.set(0.5);

    // Decorative line
    var line = g.add.graphics(cx - 150, cy + 10);
    line.lineStyle(2, 0xFFD700, 0.6);
    line.moveTo(0, 0);
    line.lineTo(300, 0);

    // Play again
    var restart = g.add.text(cx, cy + 50, 'Press ENTER to Play Again', {
      font: '18px monospace', fill: '#ffffff'
    });
    restart.anchor.set(0.5);
    g.add.tween(restart).to({ alpha: [0.3, 1] }, 1200, null, true, 0, -1);

    // Credits
    var credits = g.add.text(cx, cy + 100, 'A Shadow Shinobi Production', {
      font: '12px monospace', fill: '#484f58'
    });
    credits.anchor.set(0.5);

    g.input.keyboard.addKey(Phaser.KeyCode.ENTER)
      .onDown.addOnce(function () { g.state.start('MainMenu'); });
    g.input.onDown.addOnce(function () { g.state.start('MainMenu'); });
  }
};
