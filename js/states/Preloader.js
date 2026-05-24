var NS = NS || {};

NS.Preloader = function (game) {};
NS.Preloader.prototype = {
  preload: function () {
    for (var i = 1; i <= 5; i++) {
      this.game.load.json('level:' + i, 'data/level0' + i + '.json');
    }
    var style = { font: '24px monospace', fill: '#e63946' };
    this.loadingText = this.game.add.text(
      this.game.world.centerX, this.game.world.centerY, 'Loading...', style
    );
    this.loadingText.anchor.set(0.5);
  },
  create: function () {
    this._generatePlaceholders();
    this.game.state.start('MainMenu');
  },
  _generatePlaceholders: function () {
    var g = this.game;

    // --- Particle textures (tiny colored squares) ---
    this._makeParticle('particle_white', '#ffffff');
    this._makeParticle('particle_red', '#ff2222');
    this._makeParticle('particle_yellow', '#ffd700');
    this._makeParticle('particle_orange', '#ff8800');
    this._makeParticle('particle_purple', '#aa44ff');
    this._makeParticle('particle_cyan', '#00eeff');

    // --- Ground tile (dirt with grass top) ---
    var gnd = g.make.bitmapData(32, 32);
    gnd.ctx.fillStyle = '#5C4033';
    gnd.ctx.fillRect(0, 0, 32, 32);
    gnd.ctx.fillStyle = '#3B2D1F';
    gnd.ctx.fillRect(0, 16, 32, 16);
    gnd.ctx.fillStyle = '#2d6a2d';
    gnd.ctx.fillRect(0, 0, 32, 6);
    gnd.ctx.fillStyle = '#3a8a3a';
    gnd.ctx.fillRect(2, 0, 4, 3);
    gnd.ctx.fillRect(12, 1, 5, 3);
    gnd.ctx.fillRect(22, 0, 6, 2);
    gnd.ctx.fillRect(8, 0, 3, 2);
    gnd.ctx.fillRect(28, 1, 3, 2);
    g.cache.addImage('ground', null, gnd.canvas);

    // --- Grass platform variants ---
    this._makePlatform('grass:1x1', 32, 16);
    this._makePlatform('grass:2x1', 64, 16);
    this._makePlatform('grass:4x1', 128, 16);
    this._makePlatform('grass:8x1', 256, 16);

    // --- Ninja sprite sheet (12 frames, 32x32) ---
    var nW = 32 * 12, nH = 32;
    var ninja = g.make.bitmapData(nW, nH);
    for (var nf = 0; nf < 12; nf++) {
      var nx = nf * 32;
      ninja.ctx.fillStyle = '#1a1a2e';
      ninja.ctx.fillRect(nx + 10, 8, 12, 16);
      ninja.ctx.fillStyle = '#2a2a3e';
      ninja.ctx.beginPath();
      ninja.ctx.arc(nx + 16, 8, 7, 0, Math.PI * 2);
      ninja.ctx.fill();
      ninja.ctx.fillStyle = '#e63946';
      ninja.ctx.fillRect(nx + 9, 5, 14, 3);
      if (nf >= 4 && nf <= 7) {
        ninja.ctx.fillRect(nx + 23, 5, 6, 2);
      }
      ninja.ctx.fillStyle = '#ffffff';
      ninja.ctx.fillRect(nx + 12, 7, 4, 2);
      ninja.ctx.fillStyle = '#1a1a2e';
      var legOffset = (nf % 4) * 2;
      ninja.ctx.fillRect(nx + 10, 24, 5, 8 - legOffset);
      ninja.ctx.fillRect(nx + 17, 24 + legOffset, 5, 8 - legOffset);
      ninja.ctx.fillStyle = '#c0c0c0';
      ninja.ctx.fillRect(nx + 22, 12, 8, 2);
    }
    g.cache.addSpriteSheet('ninja', null, ninja.canvas, 32, 32);

    // --- Ronin sprite sheet (4 frames, 32x32) ---
    var rW = 32 * 4;
    var ronin = g.make.bitmapData(rW, 32);
    for (var rf = 0; rf < 4; rf++) {
      var rx = rf * 32;
      ronin.ctx.fillStyle = '#4a4a58';
      ronin.ctx.fillRect(rx + 10, 6, 12, 18);
      ronin.ctx.fillStyle = '#5a5a68';
      ronin.ctx.beginPath();
      ronin.ctx.arc(rx + 16, 7, 7, 0, Math.PI * 2);
      ronin.ctx.fill();
      ronin.ctx.fillStyle = '#3a3a48';
      ronin.ctx.fillRect(rx + 6, 2, 20, 4);
      ronin.ctx.fillRect(rx + 10, 0, 12, 3);
      ronin.ctx.fillStyle = '#e63946';
      ronin.ctx.fillRect(rx + 12, 6, 3, 2);
      ronin.ctx.fillRect(rx + 17, 6, 3, 2);
      ronin.ctx.fillStyle = '#4a4a58';
      var rleg = (rf % 4) * 2;
      ronin.ctx.fillRect(rx + 10, 24, 5, 8 - rleg);
      ronin.ctx.fillRect(rx + 17, 24 + rleg, 5, 8 - rleg);
    }
    g.cache.addSpriteSheet('ronin', null, ronin.canvas, 32, 32);

    // --- Bat sprite sheet (4 frames, 24x24) ---
    var bW = 24 * 4;
    var bat = g.make.bitmapData(bW, 24);
    for (var bf = 0; bf < 4; bf++) {
      var bx = bf * 24;
      bat.ctx.fillStyle = '#6B21A8';
      bat.ctx.beginPath();
      bat.ctx.arc(bx + 12, 12, 5, 0, Math.PI * 2);
      bat.ctx.fill();
      bat.ctx.fillStyle = '#9333EA';
      var wingY = (bf % 2 === 0) ? 6 : 10;
      bat.ctx.beginPath();
      bat.ctx.moveTo(bx + 7, 10);
      bat.ctx.lineTo(bx, wingY);
      bat.ctx.lineTo(bx + 4, 14);
      bat.ctx.closePath();
      bat.ctx.fill();
      bat.ctx.beginPath();
      bat.ctx.moveTo(bx + 17, 10);
      bat.ctx.lineTo(bx + 24, wingY);
      bat.ctx.lineTo(bx + 20, 14);
      bat.ctx.closePath();
      bat.ctx.fill();
      bat.ctx.fillStyle = '#ff0000';
      bat.ctx.fillRect(bx + 9, 11, 2, 2);
      bat.ctx.fillRect(bx + 14, 11, 2, 2);
    }
    g.cache.addSpriteSheet('bat', null, bat.canvas, 24, 24);

    // --- Oni Demon sprite sheet (4 frames, 48x48) ---
    var oW = 48 * 4;
    var oni = g.make.bitmapData(oW, 48);
    for (var ofr = 0; ofr < 4; ofr++) {
      var ox = ofr * 48;
      oni.ctx.fillStyle = '#8B0000';
      oni.ctx.fillRect(ox + 10, 14, 28, 26);
      oni.ctx.fillStyle = '#A00000';
      oni.ctx.beginPath();
      oni.ctx.arc(ox + 24, 14, 12, 0, Math.PI * 2);
      oni.ctx.fill();
      oni.ctx.fillStyle = '#FFD700';
      oni.ctx.beginPath();
      oni.ctx.moveTo(ox + 14, 6);
      oni.ctx.lineTo(ox + 10, -2);
      oni.ctx.lineTo(ox + 18, 4);
      oni.ctx.closePath();
      oni.ctx.fill();
      oni.ctx.beginPath();
      oni.ctx.moveTo(ox + 34, 6);
      oni.ctx.lineTo(ox + 38, -2);
      oni.ctx.lineTo(ox + 30, 4);
      oni.ctx.closePath();
      oni.ctx.fill();
      oni.ctx.fillStyle = '#FFFF00';
      oni.ctx.fillRect(ox + 18, 12, 4, 4);
      oni.ctx.fillRect(ox + 28, 12, 4, 4);
      oni.ctx.fillStyle = '#FFD700';
      oni.ctx.fillRect(ox + 19, 20, 10, 3);
      oni.ctx.fillStyle = '#8B0000';
      var oleg = (ofr % 4) * 3;
      oni.ctx.fillRect(ox + 12, 40, 8, 8 - oleg);
      oni.ctx.fillRect(ox + 28, 40 + oleg, 8, 8 - oleg);
    }
    g.cache.addSpriteSheet('oni', null, oni.canvas, 48, 48);

    // --- Coin sprite sheet (4 frames, 22x22) ---
    var cW = 22 * 4;
    var coin = g.make.bitmapData(cW, 22);
    for (var cf = 0; cf < 4; cf++) {
      var cxx = cf * 22;
      coin.ctx.fillStyle = '#FFD700';
      coin.ctx.beginPath();
      coin.ctx.arc(cxx + 11, 11, 10, 0, Math.PI * 2);
      coin.ctx.fill();
      coin.ctx.fillStyle = '#DAA520';
      coin.ctx.beginPath();
      coin.ctx.arc(cxx + 11, 11, 6, 0, Math.PI * 2);
      coin.ctx.fill();
      coin.ctx.fillStyle = '#FFD700';
      coin.ctx.font = 'bold 10px monospace';
      coin.ctx.fillText('$', cxx + 7, 15);
    }
    g.cache.addSpriteSheet('coin', null, coin.canvas, 22, 22);

    // --- Key ---
    var keyBmd = g.make.bitmapData(20, 22);
    keyBmd.ctx.fillStyle = '#C0C0C0';
    keyBmd.ctx.fillRect(8, 0, 4, 14);
    keyBmd.ctx.fillRect(4, 0, 12, 4);
    keyBmd.ctx.fillStyle = '#FFD700';
    keyBmd.ctx.beginPath();
    keyBmd.ctx.arc(10, 4, 6, 0, Math.PI * 2);
    keyBmd.ctx.fill();
    keyBmd.ctx.fillStyle = '#0a0a2e';
    keyBmd.ctx.beginPath();
    keyBmd.ctx.arc(10, 4, 3, 0, Math.PI * 2);
    keyBmd.ctx.fill();
    keyBmd.ctx.fillStyle = '#C0C0C0';
    keyBmd.ctx.fillRect(12, 14, 6, 3);
    keyBmd.ctx.fillRect(12, 18, 4, 3);
    g.cache.addImage('key', null, keyBmd.canvas);

    // --- Star ---
    this._makeStar('star', 24, 24, '#FFD700');

    // --- Door sprite sheet (2 frames, 42x66) ---
    var dW = 42 * 2;
    var door = g.make.bitmapData(dW, 66);
    for (var df = 0; df < 2; df++) {
      var dx = df * 42;
      door.ctx.fillStyle = '#654321';
      door.ctx.fillRect(dx, 0, 42, 66);
      door.ctx.fillStyle = df === 0 ? '#8B6914' : '#A07828';
      door.ctx.fillRect(dx + 4, 4, 34, 28);
      door.ctx.fillRect(dx + 4, 36, 34, 26);
      door.ctx.fillStyle = '#FFD700';
      door.ctx.beginPath();
      door.ctx.arc(dx + 34, 36, 3, 0, Math.PI * 2);
      door.ctx.fill();
      door.ctx.strokeStyle = '#654321';
      door.ctx.lineWidth = 1;
      door.ctx.strokeRect(dx + 8, 8, 26, 20);
      door.ctx.strokeRect(dx + 8, 40, 26, 18);
    }
    g.cache.addSpriteSheet('door', null, door.canvas, 42, 66);

    // --- Kunai ---
    var kunai = g.make.bitmapData(16, 8);
    kunai.ctx.fillStyle = '#A0A0A0';
    kunai.ctx.beginPath();
    kunai.ctx.moveTo(16, 4);
    kunai.ctx.lineTo(8, 0);
    kunai.ctx.lineTo(8, 8);
    kunai.ctx.closePath();
    kunai.ctx.fill();
    kunai.ctx.fillStyle = '#8B4513';
    kunai.ctx.fillRect(0, 2, 8, 4);
    g.cache.addImage('kunai', null, kunai.canvas);

    // --- HUD icons ---
    this._makeHUDCoin('coin_icon');
    this._makeHUDKey('key_icon', '#484f58');
    this._makeHUDKey('key_icon_lit', '#C0C0C0');
    this._makeHUDHeart('heart_icon');
    this._makeHUDStar('star_icon');

    // --- Invisible wall ---
    var iw = g.make.bitmapData(8, 32);
    g.cache.addImage('invisible_wall', null, iw.canvas);

    // --- Parallax backgrounds ---
    this._makeBgLayer('bg_far', '#05051a', '#0a0a2e', 0.1);
    this._makeBgLayer('bg_mid', '#0a0a25', '#0f0f35', 0.15);
    this._makeBgLayer('bg_near', '#0f0f30', '#151545', 0.2);

    // --- Spike ---
    var sp = g.make.bitmapData(32, 16);
    sp.ctx.fillStyle = '#8B0000';
    for (var si = 0; si < 4; si++) {
      sp.ctx.beginPath();
      sp.ctx.moveTo(si * 8, 16);
      sp.ctx.lineTo(si * 8 + 4, 2);
      sp.ctx.lineTo(si * 8 + 8, 16);
      sp.ctx.closePath();
      sp.ctx.fill();
    }
    sp.ctx.fillStyle = '#FF4444';
    for (var si2 = 0; si2 < 4; si2++) {
      sp.ctx.beginPath();
      sp.ctx.moveTo(si2 * 8 + 1, 14);
      sp.ctx.lineTo(si2 * 8 + 4, 4);
      sp.ctx.lineTo(si2 * 8 + 7, 14);
      sp.ctx.closePath();
      sp.ctx.fill();
    }
    g.cache.addImage('spike', null, sp.canvas);

    // --- Falling platform ---
    var fp = g.make.bitmapData(64, 16);
    fp.ctx.fillStyle = '#A0522D';
    fp.ctx.fillRect(0, 0, 64, 16);
    fp.ctx.fillStyle = '#8B4513';
    fp.ctx.fillRect(0, 0, 64, 4);
    fp.ctx.strokeStyle = '#6B3410';
    fp.ctx.lineWidth = 1;
    fp.ctx.beginPath();
    fp.ctx.moveTo(15, 4); fp.ctx.lineTo(20, 16);
    fp.ctx.moveTo(40, 4); fp.ctx.lineTo(38, 10); fp.ctx.lineTo(45, 16);
    fp.ctx.stroke();
    g.cache.addImage('platform_fall', null, fp.canvas);

    // --- Moving platform ---
    var mp = g.make.bitmapData(96, 16);
    mp.ctx.fillStyle = '#696969';
    mp.ctx.fillRect(0, 0, 96, 16);
    mp.ctx.fillStyle = '#808080';
    mp.ctx.fillRect(0, 0, 96, 4);
    mp.ctx.fillStyle = '#A9A9A9';
    mp.ctx.beginPath(); mp.ctx.arc(10, 8, 3, 0, Math.PI * 2); mp.ctx.fill();
    mp.ctx.beginPath(); mp.ctx.arc(48, 8, 3, 0, Math.PI * 2); mp.ctx.fill();
    mp.ctx.beginPath(); mp.ctx.arc(86, 8, 3, 0, Math.PI * 2); mp.ctx.fill();
    g.cache.addImage('platform_move', null, mp.canvas);
  },

  // --- Helper methods ---
  _makeParticle: function (key, color) {
    var bmd = this.game.make.bitmapData(4, 4);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(0, 0, 4, 4);
    this.game.cache.addImage(key, null, bmd.canvas);
  },
  _makePlatform: function (key, w, h) {
    var bmd = this.game.make.bitmapData(w, h);
    bmd.ctx.fillStyle = '#5C4033';
    bmd.ctx.fillRect(0, 0, w, h);
    bmd.ctx.fillStyle = '#3a8a3a';
    bmd.ctx.fillRect(0, 0, w, 5);
    bmd.ctx.fillStyle = '#2d6a2d';
    bmd.ctx.fillRect(2, 0, 4, 3);
    bmd.ctx.fillRect(w - 8, 1, 5, 3);
    bmd.ctx.fillStyle = '#4a7a3a';
    bmd.ctx.fillRect(Math.floor(w / 3), 0, 6, 2);
    this.game.cache.addImage(key, null, bmd.canvas);
  },
  _makeStar: function (key, w, h, color) {
    var bmd = this.game.make.bitmapData(w, h);
    bmd.ctx.fillStyle = color;
    bmd.ctx.beginPath();
    for (var i = 0; i < 5; i++) {
      var angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
      var r = 11;
      var method = (i === 0) ? 'moveTo' : 'lineTo';
      bmd.ctx[method](12 + Math.cos(angle) * r, 12 + Math.sin(angle) * r);
      var innerAngle = angle + 2 * Math.PI / 5;
      bmd.ctx.lineTo(12 + Math.cos(innerAngle) * 5, 12 + Math.sin(innerAngle) * 5);
    }
    bmd.ctx.closePath();
    bmd.ctx.fill();
    bmd.ctx.fillStyle = '#FFF8DC';
    bmd.ctx.beginPath();
    bmd.ctx.arc(12, 10, 3, 0, Math.PI * 2);
    bmd.ctx.fill();
    this.game.cache.addImage(key, null, bmd.canvas);
  },
  _makeHUDCoin: function (key) {
    var bmd = this.game.make.bitmapData(22, 22);
    bmd.ctx.fillStyle = '#FFD700';
    bmd.ctx.beginPath();
    bmd.ctx.arc(11, 11, 10, 0, Math.PI * 2);
    bmd.ctx.fill();
    bmd.ctx.fillStyle = '#DAA520';
    bmd.ctx.beginPath();
    bmd.ctx.arc(11, 11, 6, 0, Math.PI * 2);
    bmd.ctx.fill();
    bmd.ctx.fillStyle = '#FFD700';
    bmd.ctx.font = 'bold 10px monospace';
    bmd.ctx.fillText('$', 7, 15);
    this.game.cache.addImage(key, null, bmd.canvas);
  },
  _makeHUDKey: function (key, color) {
    var bmd = this.game.make.bitmapData(22, 22);
    bmd.ctx.fillStyle = color;
    bmd.ctx.beginPath();
    bmd.ctx.arc(11, 8, 6, 0, Math.PI * 2);
    bmd.ctx.fill();
    bmd.ctx.fillStyle = '#0a0a2e';
    bmd.ctx.beginPath();
    bmd.ctx.arc(11, 8, 3, 0, Math.PI * 2);
    bmd.ctx.fill();
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(9, 12, 4, 10);
    bmd.ctx.fillRect(13, 16, 4, 3);
    bmd.ctx.fillRect(13, 20, 3, 2);
    this.game.cache.addImage(key, null, bmd.canvas);
  },
  _makeHUDHeart: function (key) {
    var bmd = this.game.make.bitmapData(22, 22);
    bmd.ctx.fillStyle = '#e63946';
    bmd.ctx.beginPath();
    bmd.ctx.arc(7, 8, 5, 0, Math.PI * 2);
    bmd.ctx.fill();
    bmd.ctx.beginPath();
    bmd.ctx.arc(15, 8, 5, 0, Math.PI * 2);
    bmd.ctx.fill();
    bmd.ctx.beginPath();
    bmd.ctx.moveTo(2, 10);
    bmd.ctx.lineTo(11, 20);
    bmd.ctx.lineTo(20, 10);
    bmd.ctx.closePath();
    bmd.ctx.fill();
    this.game.cache.addImage(key, null, bmd.canvas);
  },
  _makeHUDStar: function (key) {
    this._makeStar(key, 22, 22, '#FFD700');
  },
  _makeBgLayer: function (key, color1, color2, mountainAlpha) {
    var W = 960, H = 540;
    var bmd = this.game.make.bitmapData(W, H);
    var grd = bmd.ctx.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    bmd.ctx.fillStyle = grd;
    bmd.ctx.fillRect(0, 0, W, H);
    bmd.ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (var i = 0; i < 80; i++) {
      bmd.ctx.fillRect(Math.random() * W, Math.random() * H * 0.6, 1, 1);
    }
    bmd.ctx.fillStyle = 'rgba(0,0,0,' + mountainAlpha + ')';
    bmd.ctx.beginPath();
    bmd.ctx.moveTo(0, H);
    var segs = 10;
    for (var s = 0; s <= segs; s++) {
      var sx = (s / segs) * W;
      var sy = H * 0.4 + Math.sin(s * 1.3) * H * 0.15 + Math.cos(s * 0.7) * H * 0.1;
      bmd.ctx.lineTo(sx, sy);
    }
    bmd.ctx.lineTo(W, H);
    bmd.ctx.closePath();
    bmd.ctx.fill();
    bmd.ctx.fillStyle = 'rgba(20,15,10,0.3)';
    bmd.ctx.fillRect(0, H - 60, W, 60);
    this.game.cache.addImage(key, null, bmd.canvas);
  }
};
