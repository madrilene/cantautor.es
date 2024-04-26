document.addEventListener('DOMContentLoaded', function () {
  class CustomAudio extends HTMLElement {
    constructor() {
      super();
      this.attachAudioEvents();
    }

    attachAudioEvents() {
      const playButton = this.querySelector('.play-button');
      const audioElement = this.querySelector('audio');
      const progressSlider = this.querySelector('input[type=range]');
      const currentTimeDisplay = this.querySelector('.current-time');
      const totalTimeDisplay = this.querySelector('.total-time');
      const playIcon = this.querySelector('.play-icon');
      const pauseIcon = this.querySelector('.pause-icon');
      const fadeDuration = 2; // seconds

      audioElement.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = this.formatTime(audioElement.duration);
        progressSlider.max = 100; // Set maximum as 100 for percentage calculation
        progressSlider.value = 0; // Initialize slider
      });

      playButton.addEventListener('click', () => {
        if (audioElement.paused) {
          audioElement.currentTime = 0;
          audioElement.play();
          this.fadeAudioIn(audioElement, fadeDuration);
          playIcon.style.display = 'none';
          pauseIcon.style.display = '';
          playButton.setAttribute('aria-pressed', 'true');
        } else {
          this.fadeAudioOut(audioElement, fadeDuration);
          setTimeout(() => {
            audioElement.pause();
            playIcon.style.display = '';
            pauseIcon.style.display = 'none';
            playButton.setAttribute('aria-pressed', 'false');
          }, fadeDuration * 1000);
        }
      });

      audioElement.addEventListener('timeupdate', () => {
        const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
        progressSlider.value = progressPercent;
        currentTimeDisplay.textContent = this.formatTime(audioElement.currentTime);

        if (audioElement.duration - audioElement.currentTime <= fadeDuration && !audioElement.paused) {
          this.fadeAudioOut(audioElement, fadeDuration);
        }
      });

      progressSlider.addEventListener('input', () => {
        const seekTime = (progressSlider.value / 100) * audioElement.duration;
        audioElement.currentTime = seekTime;
      });
    }

    fadeAudioIn(audio, duration) {
      let volume = 0;
      audio.volume = volume;
      const fadeStep = 1 / (duration * 10); // Adjust steps for smoother fade

      const fadeAudioInterval = setInterval(() => {
        if (volume < 1) {
          volume += fadeStep;
          audio.volume = volume;
        } else {
          clearInterval(fadeAudioInterval);
        }
      }, 100);
    }

    fadeAudioOut(audio, duration) {
      let volume = audio.volume;
      const fadeStep = 1 / (duration * 10); // Adjust steps for smoother fade

      const fadeAudioInterval = setInterval(() => {
        if (volume > 0) {
          volume -= fadeStep;
          audio.volume = volume;
        } else {
          clearInterval(fadeAudioInterval);
        }
      }, 100);
    }

    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }

  window.customElements.define('custom-audio', CustomAudio);
});
