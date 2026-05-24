var NS = NS || {};

NS.AudioManager = {
  muted: false,
  sounds: {},
  init: function (game) {
    NS.AudioManager.game = game;
  },
  play: function (key) {
    if (NS.AudioManager.muted) return;
    if (NS.AudioManager.sounds[key]) {
      NS.AudioManager.sounds[key].play();
    }
  },
  toggleMute: function () {
    NS.AudioManager.muted = !NS.AudioManager.muted;
    return NS.AudioManager.muted;
  }
};
