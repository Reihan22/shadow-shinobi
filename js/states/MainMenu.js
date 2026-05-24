NS.MainMenu = function (game) {
  this._particles = [];
  this._stars = [];
};

NS.MainMenu.prototype = {
  create: function () {
    var g = this.game;
    var W = g.width, H = g.height;
    var cx = W / 2, cy = H / 2;

    // Deep gradient background
    var bg = g.add.bitmapData(W, H);
    var grd = bg.ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, '#000008');
    grd.addColorStop(0.3, '#0a0a2e');
    grd.addColorStop(0.7, '#0d1117');
    grd.addColorStop(1, '#161b22');
    bg.ctx.fillStyle = grd;
    bg.ctx.fillRect(0, 0, W, H);
    bg.ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (var i = 0; i < 200; i++) {
      bg.ctx.fillRect(Math.random()*W, Math.random()*H, 1, 1);
    }
    g.add.image(0, 0, bg);

    // Distant stars twinkling
    this._stars = [];
    for (var s = 0; s < 40; s++) {
      var sx = Math.random() * W;
      var sy = Math.random() * H * 0.7;
      var star = g.add.graphics(sx, sy);
      star.beginFill(0xffffff, 0.3 + Math.random() * 0.7);
      star.drawRect(0, 0, Math.random() > 0.7 ? 2 : 1, Math.random() > 0.7 ? 2 : 1);
      star.endFill();
      star._twinkleSpeed = 0.5 + Math.random() * 2;
      star._twinkleOffset = Math.random() * Math.PI * 2;
      this._stars.push(star);
    }

    // Atmospheric fog layers
    for (var f = 0; f < 3; f++) {
      var fogBmd = g.add.bitmapData(W, 120);
      var fy = H * 0.55 + f * 60;
      var fogAlpha = 0.03 + f * 0.015;
      fogBmd.ctx.fillStyle = 'rgba(100,120,180,' + fogAlpha + ')';
      for (var fj = 0; fj < 8; fj++) {
        var fw = 150 + Math.random() * 300;
        var fh = 40 + Math.random() * 80;
        var fx = Math.random() * W;
        fogBmd.ctx.beginPath();
        fogBmd.ctx.ellipse(fx, 60, fw, fh, 0, 0, Math.PI * 2);
        fogBmd.ctx.fill();
      }
      var fog = g.add.image(0, fy, fogBmd);
      g.add.tween(fog).to({ x: [50, 0] }, 8000 + f * 3000, null, true, 0, -1, true);
    }

    // Mountain silhouettes
    var mtBmd = g.add.bitmapData(W, 300);
    mtBmd.ctx.fillStyle = '#080815';
    mtBmd.ctx.beginPath();
    mtBmd.ctx.moveTo(0, 300);
    var peaks = [
      [0, 180], [80, 120], [160, 160], [280, 60], [360, 140],
      [480, 80], [560, 130], [680, 40], [760, 110], [860, 70], [960, 150], [960, 300]
    ];
    for (var p = 0; p < peaks.length; p++) {
      mtBmd.ctx.lineTo(peaks[p][0], peaks[p][1]);
    }
    mtBmd.ctx.closePath();
    mtBmd.ctx.fill();
    g.add.image(0, H - 280, mtBmd);

    // Pagoda silhouette
    var pagBmd = g.add.bitmapData(200, 250);
    pagBmd.ctx.fillStyle = '#060610';
    // Base
    pagBmd.ctx.fillRect(60, 200, 80, 50);
    // Tiers
    for (var t = 0; t < 4; t++) {
      var tw = 70 - t * 12;
      var tx = 100 - tw / 2;
      var ty = 195 - t * 45;
      pagBmd.ctx.beginPath();
      pagBmd.ctx.moveTo(tx - 10, ty);
      pagBmd.ctx.lineTo(tx + tw + 10, ty);
      pagBmd.ctx.lineTo(tx + tw, ty + 20);
      pagBmd.ctx.lineTo(tx, ty + 20);
      pagBmd.ctx.closePath();
      pagBmd.ctx.fill();
      pagBmd.ctx.fillRect(tx + 5, ty - 20, tw - 10, 20);
    }
    // Spire
    pagBmd.ctx.fillRect(98, 15, 4, 40);
    pagBmd.ctx.beginPath();
    pagBmd.ctx.arc(100, 12, 5, 0, Math.PI * 2);
    pagBmd.ctx.fill();
    g.add.image(W - 220, H - 260, pagBmd);

    // Ground silhouette
    var groundBmd = g.add.bitmapData(W, 80);
    groundBmd.ctx.fillStyle = '#050510';
    groundBmd.ctx.fillRect(0, 0, W, 80);
    groundBmd.ctx.fillStyle = '#0a0a1a';
    for (var gi = 0; gi < W; gi += 32) {
      groundBmd.ctx.fillRect(gi, 0, 16, 4);
    }
    g.add.image(0, H - 60, groundBmd);

    // Floating particles (fireflies)
    this._particles = [];
    for (var pi = 0; pi < 15; pi++) {
      var pt = g.add.graphics(Math.random() * W, H * 0.3 + Math.random() * H * 0.5);
      var pSize = 1 + Math.random() * 2;
      pt.beginFill(0xe63946, 0.6);
      pt.drawCircle(0, 0, pSize);
      pt.endFill();
      pt._baseX = pt.x;
      pt._baseY = pt.y;
      pt._phase = Math.random() * Math.PI * 2;
      pt._speed = 0.3 + Math.random() * 0.8;
      pt._range = 20 + Math.random() * 40;
      this._particles.push(pt);
    }

    // Ninja silhouette (center-right)
    var ninjaBmd = g.add.bitmapData(80, 120);
    var nc = ninjaBmd.ctx;
    nc.fillStyle = '#0a0a20';
    // Body
    nc.fillRect(30, 40, 20, 50);
    // Head
    nc.beginPath();
    nc.arc(40, 30, 14, 0, Math.PI * 2);
    nc.fill();
    // Headband
    nc.fillStyle = '#e63946';
    nc.fillRect(26, 25, 28, 5);
    // Headband tail
    nc.fillRect(54, 25, 20, 4);
    // Eye slit
    nc.fillStyle = '#ffffff';
    nc.fillRect(32, 27, 16, 3);
    // Sword
    nc.fillStyle = '#c0c0c0';
    nc.save();
    nc.translate(55, 50);
    nc.rotate(-0.4);
    nc.fillRect(-2, -40, 3, 80);
    // Handle
    nc.fillStyle = '#8B4513';
    nc.fillRect(-3, 20, 5, 15);
    // Guard
    nc.fillStyle = '#FFD700';
    nc.fillRect(-5, 17, 9, 4);
    nc.restore();
    // Legs
    nc.fillStyle = '#0a0a20';
    nc.fillRect(30, 90, 8, 30);
    nc.fillRect(42, 90, 8, 30);
    var ninjaSprite = g.add.image(cx + 180, H - 200, ninjaBmd);
    ninjaSprite.anchor.set(0.5, 1);
    ninjaSprite.alpha = 0.15;

    // Red glow behind title
    var glowBmd = g.add.bitmapData(600, 200);
    var grd2 = glowBmd.ctx.createRadialGradient(300, 100, 10, 300, 100, 300);
    grd2.addColorStop(0, 'rgba(230,57,70,0.15)');
    grd2.addColorStop(0.5, 'rgba(230,57,70,0.05)');
    grd2.addColorStop(1, 'rgba(230,57,70,0)');
    glowBmd.ctx.fillStyle = grd2;
    glowBmd.ctx.fillRect(0, 0, 600, 200);
    var glow = g.add.image(cx - 30, 100, glowBmd);
    glow.anchor.set(0.5);
    g.add.tween(glow.scale).to({ x: [1.05, 1], y: [1.05, 1] }, 3000, null, true, 0, -1);

    // Title — SHADOW
    var shadowStyle = { font: '64px monospace', fill: '#e63946', stroke: '#1a0000', strokeThickness: 4 };
    var shadow = g.add.text(cx, 80, 'SHADOW', shadowStyle);
    shadow.anchor.set(0.5);
    shadow.setShadow(0, 0, 'rgba(230,57,70,0.6)', 20);

    // Title — SHINOBI
    var shinobiStyle = { font: '80px monospace', fill: '#ffffff', stroke: '#1a1a2e', strokeThickness: 6 };
    var shinobi = g.add.text(cx, 145, 'SHINOBI', shinobiStyle);
    shinobi.anchor.set(0.5);
    shinobi.setShadow(0, 0, 'rgba(255,255,255,0.3)', 15);

    // Subtitle line
    var lineBmd = g.add.bitmapData(300, 2);
    lineBmd.ctx.fillStyle = '#e63946';
    lineBmd.ctx.fillRect(0, 0, 300, 2);
    var line = g.add.image(cx, 190, lineBmd);
    line.anchor.set(0.5);
    line.alpha = 0.6;

    // Instructions
    var instrStyle = { font: '18px monospace', fill: '#8b949e' };
    var instr = g.add.text(cx, 210, 'Press ENTER or Click to Start', instrStyle);
    instr.anchor.set(0.5);
    // Blink effect
    g.add.tween(instr).to({ alpha: [0.3, 1] }, 1200, null, true, 0, -1);

    // Controls hint
    var ctrlStyle = { font: '13px monospace', fill: '#484f58' };
    var ctrl = g.add.text(cx, H - 40, '← → Move   ↑/SPACE Jump   X Throw Kunai', ctrlStyle);
    ctrl.anchor.set(0.5);
    ctrl.alpha = 0.7;

    // Version
    var ver = g.add.text(W - 10, H - 10, 'v1.0', { font: '11px monospace', fill: '#30363d' });
    ver.anchor.set(1, 1);

    // Input
    g.input.keyboard.addKey(Phaser.KeyCode.ENTER)
      .onDown.addOnce(this.startGame, this);
    g.input.onDown.addOnce(this.startGame, this);
  },

  update: function () {
    var now = this.game.time.now;
    // Twinkle stars
    for (var i = 0; i < this._stars.length; i++) {
      var s = this._stars[i];
      s.alpha = 0.3 + Math.sin(now / 1000 * s._twinkleSpeed + s._twinkleOffset) * 0.4;
    }
    // Float particles
    for (var j = 0; j < this._particles.length; j++) {
      var p = this._particles[j];
      p.x = p._baseX + Math.sin(now / 1000 * p._speed + p._phase) * p._range;
      p.y = p._baseY + Math.cos(now / 1000 * p._speed * 0.7 + p._phase) * p._range * 0.5;
      p.alpha = 0.3 + Math.sin(now / 800 * p._speed + p._phase) * 0.4;
    }
  },

  startGame: function () {
    this.game.state.start('Game');
  }
};
