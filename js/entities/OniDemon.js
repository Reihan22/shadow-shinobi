var NS = NS || {};

NS.OniDemon = function (game, x, y) {
  NS.Enemy.call(this, game, x, y, 'oni', 60);
  this.hp = 2;
  this.animations.add('walk', [0, 1, 2, 3], 6, true);
  this.animations.play('walk');
};

NS.OniDemon.prototype = Object.create(NS.Enemy.prototype);
NS.OniDemon.prototype.constructor = NS.OniDemon;
