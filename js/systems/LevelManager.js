var NS = NS || {};

NS.LevelManager = {
  load: function (gameState, levelNum) {
    var game = gameState.game;
    var data = NS.LevelManager.LEVELS[levelNum - 1];
    if (!data) return null;

    // Platforms
    data.platforms.forEach(function (p) {
      var repeat = p.repeat || 1;
      for (var i = 0; i < repeat; i++) {
        var sprite = gameState.platforms.create(p.x + (i * 32), p.y, p.image);
        game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
      }
    });

    // Enemy walls at platform edges
    data.platforms.forEach(function (p) {
      var repeat = p.repeat || 1;
      NS.LevelManager._spawnEnemyWall(gameState, p.x - 8, p.y, 'left');
      NS.LevelManager._spawnEnemyWall(gameState, p.x + repeat * 32 + 8, p.y, 'right');
    });

    // Moving platforms
    if (data.moving_platforms) {
      data.moving_platforms.forEach(function (mp) {
        var sprite = gameState.platforms.create(mp.x, mp.y, mp.image);
        game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
        if (mp.moveX) {
          game.add.tween(sprite)
            .to({ x: mp.x + mp.moveX }, (mp.moveX / mp.speed) * 1000, null, true, 0, -1, true);
        }
        if (mp.moveY) {
          game.add.tween(sprite)
            .to({ y: mp.y + mp.moveY }, (Math.abs(mp.moveY) / mp.speed) * 1000, null, true, 0, -1, true);
        }
      });
    }

    // Falling platforms
    if (data.falling_platforms) {
      gameState.fallingPlatformList = [];
      data.falling_platforms.forEach(function (fp) {
        var sprite = gameState.platforms.create(fp.x, fp.y, fp.image);
        game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
        sprite.isFalling = false;
        sprite.originalX = fp.x;
        sprite.originalY = fp.y;
        gameState.fallingPlatformList.push(sprite);
      });
    }

    // Spikes
    if (data.spikes) {
      gameState.spikes = game.add.group();
      data.spikes.forEach(function (s) {
        var spike = gameState.spikes.create(s.x, s.y, 'spike');
        game.physics.enable(spike);
        spike.body.allowGravity = false;
        spike.body.immovable = true;
      });
    }

    // Coins (with bob animation)
    data.coins.forEach(function (c) {
      var coin = gameState.coins.create(c.x, c.y, 'coin');
      coin.anchor.set(0.5);
      game.physics.enable(coin);
      coin.body.allowGravity = false;
      coin.animations.add('spin', [0, 1, 2, 3], 8, true);
      coin.animations.play('spin');
      // Bob up/down
      game.add.tween(coin)
        .to({ y: c.y - 6 }, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    });

    // Enemies
    if (data.enemies) {
      data.enemies.forEach(function (e) {
        var enemy;
        if (e.type === 'ronin') {
          enemy = new NS.Ronin(game, e.x, e.y);
        } else if (e.type === 'bat') {
          enemy = new NS.Bat(game, e.x, e.y);
        } else if (e.type === 'oni') {
          enemy = new NS.OniDemon(game, e.x, e.y);
        }
        if (enemy) gameState.enemies.add(enemy);
      });
    }

    // Key
    if (data.key) {
      var key = gameState.collectibles.create(data.key.x, data.key.y, 'key');
      key.anchor.set(0.5);
      game.physics.enable(key);
      key.body.allowGravity = false;
      key.itemType = 'key';
    }

    // Star
    if (data.star) {
      var star = gameState.collectibles.create(data.star.x, data.star.y, 'star');
      star.anchor.set(0.5);
      game.physics.enable(star);
      star.body.allowGravity = false;
      star.itemType = 'star';
    }

    // Door
    if (data.door) {
      gameState.door = gameState.collectibles.create(data.door.x, data.door.y, 'door');
      gameState.door.anchor.set(0.5, 1);
      game.physics.enable(gameState.door);
      gameState.door.body.allowGravity = false;
      gameState.door.itemType = 'door';
    }

    // Hero
    if (data.hero) {
      NS.Player.spawn(gameState, data.hero.x, data.hero.y);
    }

    return data;
  },

  _spawnEnemyWall: function (gameState, x, y, side) {
    var w = gameState.enemyWalls.create(x, y, 'invisible_wall');
    w.anchor.set(side === 'left' ? 1 : 0, 1);
    gameState.game.physics.enable(w);
    w.body.immovable = true;
    w.body.allowGravity = false;
  },

  LEVELS: []
};
