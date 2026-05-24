NS.Preloader = function (game) {};

NS.Preloader.prototype = {
  preload: function () {
    // Load level JSON files
    for (var i = 1; i <= 5; i++) {
      this.game.load.json('level:' + i, 'data/level0' + i + '.json');
    }
    var style = { font: '24px monospace', fill: '#ffffff' };
    this.loadingText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      'Loading...',
      style
    );
    this.loadingText.anchor.set(0.5);
  },
  create: function () {
    this._generatePlaceholders();
    this.game.state.start('MainMenu');
  },
  _generatePlaceholders: function () {
    this._makeSprite('ground', 32, 32, '#8B4513');
    this._makeSprite('grass:2x1', 64, 16, '#228B22');
    this._makeSprite('grass:4x1', 128, 16, '#228B22');
    this._makeSprite('grass:8x1', 256, 16, '#228B22');
    this._makeSprite('grass:1x1', 32, 16, '#228B22');
    this._makeSpriteSheet('ninja', 32, 32, 12, '#1a1a2e', '#e63946');
    this._makeSpriteSheet('ronin', 32, 32, 4, '#4a5568', '#718096');
    this._makeSpriteSheet('bat', 24, 24, 4, '#6B21A8', '#9333EA');
    this._makeSpriteSheet('oni', 48, 48, 4, '#DC2626', '#F87171');
    this._makeSpriteSheet('coin', 22, 22, 4, '#FFD700', '#FDE047');
    this._makeSprite('key', 20, 22, '#C0C0C0');
    this._makeSpriteSheet('door', 42, 66, 2, '#654321', '#8B6914');
    this._makeSprite('star', 24, 24, '#FFD700');
    this._makeSprite('kunai', 16, 8, '#A0A0A0');
    this._makeSprite('coin_icon', 22, 22, '#FFD700');
    this._makeSprite('key_icon', 22, 22, '#808080');
    this._makeSprite('key_icon_lit', 22, 22, '#C0C0C0');
    this._makeSprite('heart_icon', 22, 22, '#e63946');
    this._makeSprite('star_icon', 22, 22, '#FFD700');
    this._makeSprite('invisible_wall', 8, 32, '#ff0000');
    this._makeSprite('bg_far', 960, 540, '#0d0d35');
    this._makeSprite('bg_mid', 960, 540, '#111144');
    this._makeSprite('bg_near', 960, 540, '#151555');
    this._makeSprite('spike', 32, 16, '#FF4444');
    this._makeSprite('platform_fall', 64, 16, '#A0522D');
    this._makeSprite('platform_move', 96, 16, '#696969');
  },
  _makeSprite: function (key, w, h, color) {
    var bmd = this.game.make.bitmapData(w, h);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(0, 0, w, h);
    bmd.ctx.fillStyle = 'rgba(255,255,255,0.2)';
    bmd.ctx.fillRect(1, 1, w - 2, 2);
    this.game.cache.addImage(key, null, bmd.canvas);
  },
  _makeSpriteSheet: function (key, fw, fh, frames, color1, color2) {
    var w = fw * frames;
    var h = fh;
    var bmd = this.game.make.bitmapData(w, h);
    for (var i = 0; i < frames; i++) {
      bmd.ctx.fillStyle = (i % 2 === 0) ? color1 : color2;
      bmd.ctx.fillRect(i * fw, 0, fw, fh);
      bmd.ctx.fillStyle = '#ffffff';
      bmd.ctx.fillRect(i * fw + 8, 8, 3, 3);
      bmd.ctx.fillRect(i * fw + 16, 8, 3, 3);
    }
    this.game.cache.addImage(key, null, bmd.canvas);
  }
};
