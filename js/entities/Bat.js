var NS = NS || {};

NS.Bat = function (game, x, y) {
  NS.Enemy.call(this, game, x, y, 'bat', 80);
  this.anchor.set(0.5);
  this.body.allowGravity = false;
  this.startX = x;
  this.startY = y;
  this.body.velocity.x = 80;
  this.animations.add('fly', [0, 1, 2, 3], 10, true);
  this.animations.play('fly');
};

NS.Bat.prototype = Object.create(NS.Enemy.prototype);
NS.Bat.prototype.constructor = NS.Bat;

NS.Bat.prototype.update = function () {
  if (!this.body || !this.body.enable) return;
  // Sine wave Y motion overlay
  this.body.position.y = this.startY + Math.sin(this.game.time.now / 500) * 40;
};
