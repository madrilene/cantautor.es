document.addEventListener('DOMContentLoaded', () => {
  class CustomAudio extends HTMLElement {
    constructor() {
      super();
      this.attachAudioEvents();
    }

    attachAudioEvents() {
      const elements = {
        playButton: this.querySelector('.play-button'),
        audioElement: this.querySelector('audio'),
        progressSlider: this.querySelector('input[type=range]'),
        currentTimeDisplay: this.querySelector('.current-time'),
        totalTimeDisplay: this.querySelector('.total-time'),
        playIcon: this.querySelector('.play-icon'),
        pauseIcon: this.querySelector('.pause-icon')
      };

      const fadeDuration = 2; // seconds
      let isUserInteracting = false; // Flag to detect user interaction

      elements.audioElement.addEventListener('loadedmetadata', () => {
        elements.totalTimeDisplay.textContent = this.formatTime(elements.audioElement.duration);
        elements.progressSlider.max = 100; // Full scale is 100 for percentage
        elements.progressSlider.value = 0;
      });

      elements.playButton.addEventListener('click', () => {
        if (elements.audioElement.paused) {
          elements.audioElement.play();
          if (
            elements.audioElement.currentTime === 0 ||
            elements.audioElement.currentTime >= elements.audioElement.duration - fadeDuration
          ) {
            this.fadeAudioIn(elements.audioElement, fadeDuration);
          }
          elements.playIcon.style.display = 'none';
          elements.pauseIcon.style.display = '';
          elements.playButton.setAttribute('aria-pressed', 'true');
        } else {
          elements.audioElement.pause();
          elements.playIcon.style.display = '';
          elements.pauseIcon.style.display = 'none';
          elements.playButton.setAttribute('aria-pressed', 'false');
        }
      });

      elements.audioElement.addEventListener('timeupdate', () => {
        if (!isUserInteracting) {
          // Update progress only if user is not interacting
          const progressPercent = (elements.audioElement.currentTime / elements.audioElement.duration) * 100;
          elements.progressSlider.value = progressPercent;
          elements.currentTimeDisplay.textContent = this.formatTime(elements.audioElement.currentTime);
        }

        if (
          elements.audioElement.duration - elements.audioElement.currentTime <= fadeDuration &&
          elements.audioElement.currentTime > 0 &&
          !elements.audioElement.paused
        ) {
          this.fadeAudioOut(elements.audioElement, fadeDuration);
        }
      });

      elements.progressSlider.addEventListener('mousedown', () => {
        isUserInteracting = true; // User starts interacting
      });

      elements.progressSlider.addEventListener('mouseup', () => {
        isUserInteracting = false; // User stops interacting
        elements.audioElement.currentTime =
          (elements.progressSlider.value / 100) * elements.audioElement.duration;
      });

      elements.progressSlider.addEventListener('input', () => {
        const seekTime = (elements.progressSlider.value / 100) * elements.audioElement.duration;
        elements.currentTimeDisplay.textContent = this.formatTime(seekTime);
        if (!elements.audioElement.paused) {
          elements.audioElement.currentTime = seekTime;
        }
      });
    }

    fadeAudioIn(audio, duration) {
      let volume = 0;
      audio.volume = volume;
      const fadeStep = 1 / (duration * 10); // Smooth fade

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
      const fadeStep = 1 / (duration * 10); // Smooth fade

      const fadeAudioInterval = setInterval(() => {
        if (volume > 0) {
          volume -= fadeStep;
          audio.volume = volume;
        } else {
          clearInterval(fadeAudioInterval);
          audio.pause();
          audio.volume = 1; // Reset volume after fade-out completes
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
