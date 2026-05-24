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
    // Freeze briefly before kill for juice
    this.body.velocity.x = 0;
    this.tint = 0xff0000;
    var self = this;
    // Freeze frame effect
    self.game.time.events.add(80, function () {
      self.kill();
    });
  } else {
    this.tint = 0xff0000;
    this.game.time.events.add(150, function () {
      this.tint = 0xffffff;
    }, this);
    // Knockback
    this.body.velocity.y = -100;
  }
};
