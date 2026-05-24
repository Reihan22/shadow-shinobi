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

    // Parallax background layers
    var bgFar = this.game.add.tileSprite(0, 0, 960, 540, 'bg_far');
    bgFar.fixedToCamera = true;
    this.bg.add(bgFar);
    this._bgFar = bgFar;

    var bgMid = this.game.add.tileSprite(0, 0, 960, 540, 'bg_mid');
    bgMid.fixedToCamera = true;
    this.bg.add(bgMid);
    this._bgMid = bgMid;

    var bgNear = this.game.add.tileSprite(0, 0, 960, 540, 'bg_near');
    bgNear.fixedToCamera = true;
    this.bg.add(bgNear);
    this._bgNear = bgNear;

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

    // Level intro overlay
    this._showLevelIntro(levelData);
  },

  update: function () {
    if (!this.hero) return;

    // Skip update during intro
    if (this._introActive) return;

    // Parallax scrolling
    if (this._bgFar) this._bgFar.tilePosition.x = this.game.camera.x * 0.05;
    if (this._bgMid) this._bgMid.tilePosition.x = this.game.camera.x * 0.2;
    if (this._bgNear) this._bgNear.tilePosition.x = this.game.camera.x * 0.4;

    // Level timer
    this.game.time.events.add(0, function () {}, this); // keeps timer ticking
    this.levelTime += this.game.time.physicsElapsed;

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
      if (enemy.takeDamage) {
        var dead = enemy.hp <= 1;
        enemy.takeDamage();
        if (dead) NS.Player.onEnemyKill(this, enemy.x, enemy.y);
      } else {
        NS.Player.onEnemyKill(this, enemy.x, enemy.y);
        enemy.kill();
      }
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

    // Combo timer decay — reset after 2s of no kills
    if (this.comboCount > 0 && this.game.time.now - this.comboTimer > 2000) {
      this.comboCount = 0;
    }

    // HUD
    NS.HUD.update(this);
  },

  _showLevelIntro: function (levelData) {
    var game = this.game;
    this._introActive = true;
    var levelNames = ['', 'Bamboo Forest', 'Village Outskirts', 'Demon Cave', 'Shadow Castle', 'Throne Room'];

    // Dark overlay
    var overlay = game.add.graphics(0, 0);
    overlay.fixedToCamera = true;
    overlay.beginFill(0x000000, 0.85);
    overlay.drawRect(0, 0, 960, 540);
    overlay.endFill();

    // Level number
    var numText = game.add.text(480, 200, 'LEVEL ' + this.levelNum, {
      font: 'bold 48px monospace', fill: '#e63946',
      stroke: '#000', strokeThickness: 4
    });
    numText.anchor.set(0.5);
    numText.fixedToCamera = true;

    // Level name
    var nameText = game.add.text(480, 260, levelNames[this.levelNum] || '', {
      font: '20px monospace', fill: '#aaaaaa'
    });
    nameText.anchor.set(0.5);
    nameText.fixedToCamera = true;
    nameText.alpha = 0;
    game.add.tween(nameText).to({ alpha: 1 }, 400, null, true, 300);

    // Controls hint (level 1 only)
    if (this.levelNum === 1) {
      var controlsText = game.add.text(480, 340,
        'WASD/Arrows: Move   SPACE: Jump\nZ: Dash   X: Throw Kunai', {
        font: '14px monospace', fill: '#666666', align: 'center'
      });
      controlsText.anchor.set(0.5);
      controlsText.fixedToCamera = true;
      controlsText.alpha = 0;
      game.add.tween(controlsText).to({ alpha: 1 }, 400, null, true, 600);
    }

    // Fade out and start game
    game.time.events.add(1800, function () {
      var fadeOut = game.add.tween(overlay).to({ alpha: 0 }, 400, null, true);
      game.add.tween(numText).to({ alpha: 0 }, 400, null, true);
      game.add.tween(nameText).to({ alpha: 0 }, 400, null, true);
      fadeOut.onComplete.add(function () {
        overlay.destroy();
        numText.destroy();
        nameText.destroy();
        this._introActive = false;
      }, this);
    }, this);
  },

  _checkFallingPlatforms: function () {
    var hero = this.hero;
    this.fallingPlatformList.forEach(function (plat) {
      if (plat.isFalling || !plat.body) return;
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
    NS.Player.onCoinCollect(this, coin.x, coin.y);
  },

  _onCollectible: function (hero, item) {
    if (item.itemType === 'key') {
      item.kill();
      this.hasKey = true;
      NS.AudioManager.play('key');
    } else if (item.itemType === 'star') {
      item.kill();
      NS.Player.onStarCollect(this, item.x, item.y);
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
      // Stomp kill
      var willDie = enemy.hp <= 1;
      if (enemy.takeDamage) enemy.takeDamage();
      else { enemy.kill(); willDie = true; }
      hero.body.velocity.y = -NS.Player.JUMP_SPEED / 2;
      if (willDie) NS.Player.onEnemyKill(this, enemy.x, enemy.y);
    } else {
      NS.Player.kill(this);
    }
  },

  _nextLevel: function () {
    if (this.levelNum >= 5) {
      this.game.state.start('Victory', true, false, { score: this.score || 0 });
    } else {
      this.game.state.start('Game', true, false, { level: this.levelNum + 1 });
    }
  }
};
