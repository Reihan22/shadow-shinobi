var NS = NS || {};

NS.OniDemon = function (game, x, y) {
  NS.Enemy.call(this, game, x, y, 'oni', 60);
  this.hp = 3;
  this.body.setSize(30, 40, 4, 8);
  this.animations.add('walk', [0, 1, 2, 3], 6, true);
  this.animations.play('walk');
};

NS.OniDemon.prototype = Object.create(NS.Enemy.prototype);
NS.OniDemon.prototype.constructor = NS.OniDemon;

NS.OniDemon.prototype.update = function () {
  // Rage mode — speed up when low HP
  if (this.hp === 1 && this.body && this.body.enable) {
    this.body.velocity.x = (this.body.velocity.x > 0 ? 1 : -1) * 120;
    this.tint = 0xff4444;
  }
};

NS.OniDemon.prototype.takeDamage = function () {
  this.hp--;
  if (this.hp <= 0) {
    this.body.velocity.x = 0;
    this.tint = 0xff0000;
    var self = this;
    // Dramatic death — shake then explode
    self.game.add.tween(self)
      .to({ x: self.x + 3 }, 40, null, true, 0, 5, true);
    self.game.time.events.add(300, function () {
      self.game.camera.shake(0.008, 200);
      self.kill();
    });
  } else {
    this.tint = 0xff0000;
    this.game.time.events.add(200, function () {
      this.tint = this.hp === 1 ? 0xff4444 : 0xffffff;
    }, this);
    this.body.velocity.y = -150;
  }
};
