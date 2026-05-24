var NS = NS || {};

NS.Enemy = function (game, x, y, key, speed) {
  Phaser.Sprite.call(this, game, x, y, key);
  game.physics.enable(this);
  this.anchor.set(0.5, 1);
  this.body.velocity.x = speed;
  this.hp = 1;
};

NS.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
NS.Enemy.prototype.constructor = NS.Enemy;

NS.Enemy.prototype.takeDamage = function () {
  this.hp--;
  if (this.hp <= 0) {
    this.kill();
  } else {
    this.tint = 0xffffff;
    this.game.time.events.add(100, function () {
      this.tint = 0xffffff;
    }, this);
  }
};
