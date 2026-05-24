var NS = NS || {};

NS.Player = {
  SPEED: 200,
  JUMP_SPEED: 550,

  spawn: function (gameState, x, y) {
    var game = gameState.game;
    gameState.hero = game.add.sprite(x, y, 'ninja');
    gameState.hero.anchor.set(0.5, 1);
    game.physics.enable(gameState.hero);
    gameState.hero.body.collideWorldBounds = true;
    gameState.hero.animations.add('idle', [0, 1], 4, true);
    gameState.hero.animations.add('run', [4, 5, 6, 7], 10, true);
    gameState.hero.animations.add('jump', [8]);
    gameState.hero.animations.add('fall', [9]);
    gameState.hero.animations.add('throw', [10, 11], 8, false);
    gameState.hero.alive = true;
    gameState.hero.facing = 1;
    gameState.keys = game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP,
      a: Phaser.KeyCode.A,
      d: Phaser.KeyCode.D,
      w: Phaser.KeyCode.W,
      space: Phaser.KeyCode.SPACEBAR,
      throw: Phaser.KeyCode.X
    });
    gameState.keys.left2 = game.input.keyboard.addKey(Phaser.KeyCode.A);
    gameState.keys.right2 = game.input.keyboard.addKey(Phaser.KeyCode.D);
    gameState.keys.up2 = game.input.keyboard.addKey(Phaser.KeyCode.W);
  },

  handleInput: function (gameState) {
    var hero = gameState.hero;
    if (!hero.alive) return;
    var keys = gameState.keys;
    var left = keys.left.isDown || keys.left2.isDown;
    var right = keys.right.isDown || keys.right2.isDown;
    var jump = keys.up.isDown || keys.up2.isDown || keys.space.isDown;
    if (left) {
      hero.body.velocity.x = -NS.Player.SPEED;
      hero.facing = -1;
    } else if (right) {
      hero.body.velocity.x = NS.Player.SPEED;
      hero.facing = 1;
    } else {
      hero.body.velocity.x = 0;
    }
    if (jump) {
      NS.Player.jump(gameState);
    }
    hero.scale.x = hero.facing;
  },

  jump: function (gameState) {
    var hero = gameState.hero;
    if (hero.body.touching.down) {
      hero.body.velocity.y = -NS.Player.JUMP_SPEED;
    }
  },

  getAnimationName: function (gameState) {
    var hero = gameState.hero;
    if (!hero.alive) return 'idle';
    if (hero.body.velocity.y < 0) return 'jump';
    if (hero.body.velocity.y > 0 && !hero.body.touching.down) return 'fall';
    if (hero.body.velocity.x !== 0 && hero.body.touching.down) return 'run';
    return 'idle';
  },

  throwKunai: function (gameState) {
    if (gameState.kunaiCooldown) return;
    if (gameState.kunais.countLiving() > 0) return;
    var hero = gameState.hero;
    var kunai = gameState.kunais.create(hero.x, hero.y - 16, 'kunai');
    gameState.game.physics.enable(kunai);
    kunai.body.allowGravity = false;
    kunai.body.velocity.x = 400 * hero.facing;
    kunai.checkWorldBounds = true;
    kunai.outOfBoundsKill = true;
    gameState.kunaiCooldown = true;
    gameState.game.time.events.add(500, function () {
      gameState.kunaiCooldown = false;
    });
  },

  kill: function (gameState) {
    var hero = gameState.hero;
    hero.alive = false;
    hero.body.velocity.y = -NS.Player.JUMP_SPEED / 2;
    hero.body.velocity.x = 0;
    hero.body.collideWorldBounds = false;
    gameState.game.time.events.add(1000, function () {
      gameState.lives--;
      if (gameState.lives <= 0) {
        gameState.game.state.start('GameOver');
      } else {
        hero.alive = true;
        hero.body.collideWorldBounds = true;
        hero.reset(50, 400);
        hero.body.velocity.set(0);
        gameState.invincible = true;
        var blink = gameState.game.add.tween(hero)
          .to({ alpha: 0.3 }, 100, null, true, 0, 5, true);
        gameState.game.time.events.add(1500, function () {
          hero.alpha = 1;
          gameState.invincible = false;
        });
      }
    });
  }
};
