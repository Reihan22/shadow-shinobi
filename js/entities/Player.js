var NS = NS || {};

NS.Player = {
  SPEED: 200,
  JUMP_SPEED: 550,
  DASH_SPEED: 500,
  DASH_DURATION: 150,
  DASH_COOLDOWN: 600,
  WALL_SLIDE_SPEED: 60,
  WALL_JUMP_X: 250,
  WALL_JUMP_Y: 500,

  _makeEmitter: function (game, key, count, gravityY, lifespan) {
    var em = game.add.emitter(0, 0, count);
    em.makeParticles(key);
    em.setAlpha(1, 0);
    em.setScale(1.5, 0.3);
    em.gravity.y = gravityY || 0;
    em.lifespan = lifespan || 500;
    return em;
  },

  spawn: function (gameState, x, y) {
    var game = gameState.game;
    gameState.hero = game.add.sprite(x, y, 'ninja');
    gameState.hero.anchor.set(0.5, 1);
    game.physics.enable(gameState.hero);
    gameState.hero.body.collideWorldBounds = true;
    gameState.hero.body.setSize(16, 28, 0, 4);
    gameState.hero.animations.add('idle', [0, 1], 4, true);
    gameState.hero.animations.add('run', [4, 5, 6, 7], 10, true);
    gameState.hero.animations.add('jump', [8]);
    gameState.hero.animations.add('fall', [9]);
    gameState.hero.animations.add('throw', [10, 11], 8, false);
    gameState.hero.alive = true;
    gameState.hero.facing = 1;

    // Movement state
    gameState.isDashing = false;
    gameState.dashCooldown = false;
    gameState.isWallSliding = false;
    gameState.wallDir = 0;

    // Game state
    gameState.comboCount = 0;
    gameState.comboTimer = 0;
    gameState.score = 0;
    gameState.levelTime = 0;
    gameState.enemiesKilled = 0;

    // Emitters
    gameState.dashEmitter = NS.Player._makeEmitter(game, 'particle_white', 20, 0, 400);
    gameState.deathEmitter = NS.Player._makeEmitter(game, 'particle_red', 30, 300, 800);
    gameState.killEmitter = NS.Player._makeEmitter(game, 'particle_orange', 15, 200, 500);
    gameState.sparkleEmitter = NS.Player._makeEmitter(game, 'particle_yellow', 8, -50, 300);
    gameState.wallEmitter = NS.Player._makeEmitter(game, 'particle_cyan', 5, 80, 300);

    gameState.keys = game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP,
      a: Phaser.KeyCode.A,
      d: Phaser.KeyCode.D,
      w: Phaser.KeyCode.W,
      space: Phaser.KeyCode.SPACEBAR,
      throw: Phaser.KeyCode.X,
      dash: Phaser.KeyCode.Z
    });
    gameState.keys.left2 = game.input.keyboard.addKey(Phaser.KeyCode.A);
    gameState.keys.right2 = game.input.keyboard.addKey(Phaser.KeyCode.D);
    gameState.keys.up2 = game.input.keyboard.addKey(Phaser.KeyCode.W);
  },

  handleInput: function (gameState) {
    var hero = gameState.hero;
    if (!hero.alive || gameState.isDashing) return;
    var keys = gameState.keys;
    var left = keys.left.isDown || keys.left2.isDown;
    var right = keys.right.isDown || keys.right2.isDown;
    var jump = keys.up.isDown || keys.up2.isDown || keys.space.isDown;
    var dash = keys.dash.isDown;

    // Wall slide detection
    gameState.isWallSliding = false;
    if (!hero.body.touching.down && hero.body.velocity.y > 0) {
      if (hero.body.touching.left && left) {
        gameState.isWallSliding = true;
        gameState.wallDir = -1;
      } else if (hero.body.touching.right && right) {
        gameState.isWallSliding = true;
        gameState.wallDir = 1;
      }
    }

    if (gameState.isWallSliding) {
      hero.body.velocity.y = NS.Player.WALL_SLIDE_SPEED;
      hero.facing = -gameState.wallDir;
      // Wall slide particles
      if (Math.random() < 0.3) {
        var em = gameState.wallEmitter;
        em.x = hero.x + (gameState.wallDir * 8);
        em.y = hero.y - 4;
        em.start(true, 300, null, 1);
      }
    }

    // Horizontal movement
    if (left) {
      hero.body.velocity.x = -NS.Player.SPEED;
      hero.facing = -1;
    } else if (right) {
      hero.body.velocity.x = NS.Player.SPEED;
      hero.facing = 1;
    } else if (!gameState.isWallSliding) {
      hero.body.velocity.x = 0;
    }

    // Jump / Wall jump
    if (jump) {
      if (gameState.isWallSliding) {
        NS.Player.wallJump(gameState);
      } else {
        NS.Player.jump(gameState);
      }
    }

    // Dash
    if (dash && !gameState.dashCooldown) {
      NS.Player.dash(gameState);
    }

    hero.scale.x = hero.facing;
  },

  jump: function (gameState) {
    var hero = gameState.hero;
    if (hero.body.touching.down) {
      hero.body.velocity.y = -NS.Player.JUMP_SPEED;
      NS.Player._squash(gameState, 0.8, 1.2);
    }
  },

  wallJump: function (gameState) {
    var hero = gameState.hero;
    hero.body.velocity.y = -NS.Player.WALL_JUMP_Y;
    hero.body.velocity.x = -gameState.wallDir * NS.Player.WALL_JUMP_X;
    hero.facing = -gameState.wallDir;
    gameState.isWallSliding = false;
    // Wall jump particles
    var em = gameState.wallEmitter;
    em.x = hero.x;
    em.y = hero.y;
    em.start(true, 400, null, 5);
  },

  dash: function (gameState) {
    gameState.isDashing = true;
    gameState.dashCooldown = true;
    var hero = gameState.hero;
    var game = gameState.game;
    hero.body.velocity.y = 0;
    hero.body.allowGravity = false;
    hero.body.velocity.x = NS.Player.DASH_SPEED * hero.facing;

    // Dash trail
    var em = gameState.dashEmitter;
    em.x = hero.x;
    em.y = hero.y - 12;
    em.start(true, 400, null, 10);

    game.camera.shake(0.003, 100);

    game.time.events.add(NS.Player.DASH_DURATION, function () {
      hero.body.allowGravity = true;
      hero.body.velocity.x *= 0.3;
      gameState.isDashing = false;
    });

    game.time.events.add(NS.Player.DASH_COOLDOWN, function () {
      gameState.dashCooldown = false;
    });
  },

  getAnimationName: function (gameState) {
    var hero = gameState.hero;
    if (!hero.alive) return 'idle';
    if (gameState.isDashing) return 'throw';
    if (gameState.isWallSliding) return 'fall';
    if (hero.body.velocity.y < 0) return 'jump';
    if (hero.body.velocity.y > 0 && !hero.body.touching.down) return 'fall';
    if (hero.body.velocity.x !== 0 && hero.body.touching.down) return 'run';
    return 'idle';
  },

  throwKunai: function (gameState) {
    if (gameState.kunaiCooldown) return;
    if (gameState.kunais.countLiving() > 0) return;
    var hero = gameState.hero;
    var kunai = gameState.kunais.create(hero.x + hero.facing * 10, hero.y - 16, 'kunai');
    gameState.game.physics.enable(kunai);
    kunai.body.allowGravity = false;
    kunai.body.velocity.x = 500 * hero.facing;
    kunai.checkWorldBounds = true;
    kunai.outOfBoundsKill = true;
    gameState.kunaiCooldown = true;
    gameState.game.time.events.add(400, function () {
      gameState.kunaiCooldown = false;
    });
  },

  kill: function (gameState) {
    var hero = gameState.hero;
    var game = gameState.game;
    hero.alive = false;

    // Death particles
    gameState.deathEmitter.x = hero.x;
    gameState.deathEmitter.y = hero.y - 12;
    gameState.deathEmitter.start(true, 800, null, 20);

    // Camera effects
    game.camera.shake(0.015, 300);
    game.camera.flash(0xff0000, 200);

    // Death spin + launch
    hero.body.velocity.y = -NS.Player.JUMP_SPEED / 2;
    hero.body.velocity.x = 0;
    hero.body.collideWorldBounds = false;
    game.add.tween(hero).to({ angle: 360 }, 800, null, true);

    game.time.events.add(1000, function () {
      gameState.lives--;
      gameState.comboCount = 0;
      if (gameState.lives <= 0) {
        game.state.start('GameOver', true, false, { score: gameState.score });
      } else {
        hero.alive = true;
        hero.angle = 0;
        hero.body.collideWorldBounds = true;
        hero.reset(gameState.heroSpawnX, gameState.heroSpawnY);
        hero.body.velocity.set(0);
        gameState.invincible = true;
        var blink = game.add.tween(hero)
          .to({ alpha: 0.3 }, 100, null, true, 0, 7, true);
        game.time.events.add(2000, function () {
          hero.alpha = 1;
          gameState.invincible = false;
        });
      }
    });
  },

  onEnemyKill: function (gameState, enemyX, enemyY) {
    var game = gameState.game;
    gameState.enemiesKilled++;

    // Kill particles
    gameState.killEmitter.x = enemyX;
    gameState.killEmitter.y = enemyY - 8;
    gameState.killEmitter.start(true, 500, null, 10);

    // Screen shake
    game.camera.shake(0.005, 100);

    // Combo system
    var now = game.time.now;
    if (now - gameState.comboTimer < 2000) {
      gameState.comboCount++;
    } else {
      gameState.comboCount = 1;
    }
    gameState.comboTimer = now;

    var multiplier = Math.min(gameState.comboCount, 5);
    var pts = 100 * multiplier;
    gameState.score += pts;

    // Floating score text
    NS.Player._floatText(gameState, enemyX, enemyY - 20, '+' + pts,
      multiplier > 1 ? '#ff4444' : '#ffffff');

    if (multiplier > 1) {
      NS.Player._floatText(gameState, enemyX, enemyY - 36,
        'COMBO x' + multiplier + '!', '#ffcc00');
    }
  },

  onCoinCollect: function (gameState, coinX, coinY) {
    gameState.coinCount++;
    gameState.score += 10;
    NS.Player._floatText(gameState, coinX, coinY - 10, '+10', '#FFD700');

    // Coin sparkle
    gameState.sparkleEmitter.x = coinX;
    gameState.sparkleEmitter.y = coinY;
    gameState.sparkleEmitter.start(true, 300, null, 6);
  },

  onStarCollect: function (gameState, starX, starY) {
    gameState.starCount++;
    gameState.score += 500;
    NS.Player._floatText(gameState, starX, starY - 10, '+500 ★', '#ffcc00');
    gameState.game.camera.flash(0xffff00, 150);
  },

  _squash: function (gameState, scaleX, scaleY) {
    var hero = gameState.hero;
    hero.scale.set(hero.facing * scaleX, scaleY);
    gameState.game.add.tween(hero.scale)
      .to({ x: hero.facing, y: 1 }, 150, Phaser.Easing.Back.Out, true);
  },

  _floatText: function (gameState, x, y, text, color) {
    var game = gameState.game;
    var t = game.add.text(x, y, text, {
      font: 'bold 14px monospace', fill: color || '#ffffff',
      stroke: '#000000', strokeThickness: 2
    });
    t.anchor.set(0.5);
    game.add.tween(t).to({ y: y - 40, alpha: 0 }, 800, null, true);
    game.time.events.add(900, function () { t.destroy(); });
  }
};
