document.addEventListener('DOMContentLoaded', function () {
  const stage = document.querySelector('.stage');
  const artistlist = document.querySelector('.artistlist');

  function attachAudioEvents(customAudio) {
    const playButton = customAudio.querySelector('.play-button');
    const ariaName = customAudio.querySelector('.aria-name');
    const audioElement = customAudio.querySelector('audio');
    const currentTimeDisplay = customAudio.querySelector('.current-time');
    const totalTimeDisplay = customAudio.querySelector('.total-time');
    const progressFilled = customAudio.querySelector('.progress-filled');
    const playIcon = playButton.querySelector('.play-icon');
    const pauseIcon = playButton.querySelector('.pause-icon');
    let fadingOut = false;

    function fadeAudioIn() {
      audioElement.volume = 0;
      let volume = 0;
      let fadeAudioInterval = setInterval(() => {
        if (volume < 1.0) {
          volume += 0.1;
          audioElement.volume = volume;
        }
        if (volume >= 1.0) {
          clearInterval(fadeAudioInterval);
        }
      }, 200);
    }

    playButton.addEventListener('click', () => {
      if (audioElement.paused) {
        fadeAudioIn();
        audioElement.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = '';
        playButton.setAttribute('aria-pressed', 'true');
        ariaName.innerHTML = 'Audio is playing';
      } else {
        audioElement.pause();
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
        playButton.setAttribute('aria-pressed', 'false');
        ariaName.innerHTML = 'Audio is paused';
      }
    });

    audioElement.addEventListener('timeupdate', () => {
      const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
      progressFilled.style.width = `${progressPercent}%`;
      currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
    });

    audioElement.addEventListener('loadedmetadata', () => {
      totalTimeDisplay.textContent = formatTime(audioElement.duration);
    });
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function updateFeaturedArtist(artist) {
    const oldCustomAudio = stage.querySelector('custom-audio');
    if (oldCustomAudio) {
      const oldAudio = oldCustomAudio.querySelector('audio');
      if (oldAudio) {
        oldAudio.pause();
        oldAudio.currentTime = 0;
      }
    }
    stage.innerHTML = '';
    stage.appendChild(artist);
    const newCustomAudio = stage.querySelector('custom-audio');
    attachAudioEvents(newCustomAudio);
  }

  // Setup initial audio controls
  const initialCustomAudio = stage.querySelector('custom-audio');
  if (initialCustomAudio) {
    attachAudioEvents(initialCustomAudio);
  }

  // Handle artist clicks
  artistlist.querySelectorAll('custom-artist').forEach(artist => {
    artist.addEventListener('click', () => {
      updateFeaturedArtist(artist.cloneNode(true));
    });
  });
});
