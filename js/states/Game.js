NS.Game = function (game) {};

NS.Game.prototype = {
  init: function (data) {
    this.levelNum = (data && data.level) || 1;
    this.coinCount = 0;
    this.starCount = 0;
    this.lives = 3;
    this.hasKey = false;
    this.invincible = false;
    this.kunaiCooldown = false;
    this.heroSpawnX = 50;
    this.heroSpawnY = 400;
  },

  create: function () {
    this.game.stage.backgroundColor = '#0a0a2e';
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    this.bg = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.enemies = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.collectibles = this.game.add.group();
    this.kunais = this.game.add.group();
    this.enemyWalls.visible = false;

    this.game.world.setBounds(0, 0, 3000, 540);

    // Populate LevelManager.LEVELS from preloaded JSON cache
    if (NS.LevelManager.LEVELS.length === 0) {
      for (var i = 1; i <= 5; i++) {
        var data = this.game.cache.getJSON('level:' + i);
        if (data) NS.LevelManager.LEVELS.push(data);
      }
    }

    var levelData = NS.LevelManager.load(this, this.levelNum);
    if (levelData && levelData.hero) {
      this.heroSpawnX = levelData.hero.x;
      this.heroSpawnY = levelData.hero.y;
    }
    NS.HUD.create(this);
    NS.AudioManager.init(this.game);

    if (this.hero) {
      this.game.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER);
    }
  },

  update: function () {
    if (!this.hero) return;

    // Collisions
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.collide(this.enemies, this.platforms);
    this.game.physics.arcade.collide(this.enemies, this.enemyWalls);

    // Overlaps
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onCoinCollect, null, this);
    this.game.physics.arcade.overlap(this.hero, this.collectibles, this._onCollectible, null, this);
    this.game.physics.arcade.overlap(this.hero, this.enemies, this._onEnemyContact, null, this);

    // Spikes
    if (this.spikes) {
      this.game.physics.arcade.overlap(this.hero, this.spikes, function () {
        if (!this.invincible) NS.Player.kill(this);
      }, null, this);
    }

    // Kunai input
    if (this.keys && this.keys.throw.isDown && this.hero.alive) {
      NS.Player.throwKunai(this);
    }

    // Kunai vs enemies
    this.game.physics.arcade.overlap(this.kunais, this.enemies, function (kunai, enemy) {
      kunai.kill();
      if (enemy.takeDamage) enemy.takeDamage();
      else enemy.kill();
    }, null, this);

    // Kunai vs platforms
    this.game.physics.arcade.collide(this.kunais, this.platforms, function (kunai) {
      kunai.kill();
    });

    // Player input
    NS.Player.handleInput(this);

    // Animation
    this.hero.animations.play(NS.Player.getAnimationName(this));

    // Enemy wall bounce
    this.enemies.forEachAlive(function (enemy) {
      if (!enemy.body || !enemy.body.enable) return;
      var speed = Math.abs(enemy.body.velocity.x) || 80;
      if (enemy.body.touching.right || enemy.body.blocked.right) {
        enemy.body.velocity.x = -speed;
        enemy.scale.x = -1;
      } else if (enemy.body.touching.left || enemy.body.blocked.left) {
        enemy.body.velocity.x = speed;
        enemy.scale.x = 1;
      }
    });

    // Falling platform check
    if (this.fallingPlatformList) {
      this._checkFallingPlatforms();
    }

    // HUD
    NS.HUD.update(this);
  },

  _checkFallingPlatforms: function () {
    var hero = this.hero;
    this.fallingPlatformList.forEach(function (plat) {
      if (plat.isFalling || !plat.body) return;
      // Check if hero is standing on this platform
      var heroBottom = hero.body.y + hero.body.height;
      var platTop = plat.body.y;
      if (hero.body.touching.down &&
          Math.abs(heroBottom - platTop) < 5 &&
          hero.body.x + hero.body.width > plat.body.x &&
          hero.body.x < plat.body.x + plat.body.width) {
        plat.isFalling = true;
        var origX = plat.x;
        var shake = this.game.add.tween(plat)
          .to({ x: origX + 3 }, 50, null, true, 0, 4, true);
        this.game.time.events.add(500, function () {
          plat.body.allowGravity = true;
          plat.body.immovable = false;
          this.game.time.events.add(3000, function () {
            plat.reset(plat.originalX, plat.originalY);
            plat.body.allowGravity = false;
            plat.body.immovable = true;
            plat.body.velocity.set(0);
            plat.isFalling = false;
          });
        }, this);
      }
    }, this);
  },

  _onCoinCollect: function (hero, coin) {
    coin.kill();
    this.coinCount++;
    NS.AudioManager.play('coin');
  },

  _onCollectible: function (hero, item) {
    if (item.itemType === 'key') {
      item.kill();
      this.hasKey = true;
      NS.AudioManager.play('key');
    } else if (item.itemType === 'star') {
      item.kill();
      this.starCount++;
      NS.AudioManager.play('star');
    } else if (item.itemType === 'door') {
      if (this.hasKey && hero.body.touching.down) {
        hero.body.velocity.set(0);
        hero.body.enable = false;
        this.game.time.events.add(500, this._nextLevel, this);
      }
    }
  },

  _onEnemyContact: function (hero, enemy) {
    if (this.invincible) return;
    if (hero.body.velocity.y > 0 && hero.body.y + hero.body.height - 10 < enemy.body.y) {
      if (enemy.takeDamage) enemy.takeDamage();
      else enemy.kill();
      hero.body.velocity.y = -NS.Player.JUMP_SPEED / 2;
    } else {
      NS.Player.kill(this);
    }
  },

  _nextLevel: function () {
    if (this.levelNum >= 5) {
      this.game.state.start('Victory');
    } else {
      this.game.state.start('Game', true, false, { level: this.levelNum + 1 });
    }
  }
};
