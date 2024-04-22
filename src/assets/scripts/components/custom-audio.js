document.addEventListener('DOMContentLoaded', function () {
  const stage = document.querySelector('.stage');

  function attachAudioEvents(customAudio) {
    const playButton = customAudio.querySelector('.play-button');
    const ariaName = customAudio.querySelector('.aria-name');
    const audioElement = customAudio.querySelector('audio');
    const currentTimeDisplay = customAudio.querySelector('.current-time');
    const totalTimeDisplay = customAudio.querySelector('.total-time');
    const progressFilled = customAudio.querySelector('.progress-filled');
    const playIcon = playButton.querySelector('.play-icon');
    const pauseIcon = playButton.querySelector('.pause-icon');

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
        ariaName.textContent = 'Audio is playing';
      } else {
        audioElement.pause();
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
        playButton.setAttribute('aria-pressed', 'false');
        ariaName.textContent = 'Audio is paused';
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

  // Attach audio events to the initial featured artist in the stage
  const initialCustomAudio = stage.querySelector('custom-audio');
  if (initialCustomAudio) {
    attachAudioEvents(initialCustomAudio);
  }

  // Attach audio events to new artists added to the stage from the artist list
  const artistlist = document.querySelector('.artistlist');
  artistlist.addEventListener('click', event => {
    const targetArtist = event.target.closest('custom-artist');
    if (targetArtist) {
      const clonedArtist = targetArtist.cloneNode(true);
      stage.innerHTML = ''; // Clear previous content
      stage.appendChild(clonedArtist); // Add new artist
      attachAudioEvents(clonedArtist.querySelector('custom-audio'));
    }
  });
});
