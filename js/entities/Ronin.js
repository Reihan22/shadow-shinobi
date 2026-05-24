var NS = NS || {};

NS.Ronin = function (game, x, y) {
  NS.Enemy.call(this, game, x, y, 'ronin', 100);
  this.animations.add('walk', [0, 1, 2, 3], 8, true);
  this.animations.play('walk');
};

NS.Ronin.prototype = Object.create(NS.Enemy.prototype);
NS.Ronin.prototype.constructor = NS.Ronin;
