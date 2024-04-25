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

      audioElement.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = this.formatTime(audioElement.duration);
        progressSlider.max = 100; // Set maximum as 100 for percentage calculation
        progressSlider.value = 0; // Initialize slider
        // console.log('Metadata loaded, duration set:', audioElement.duration);
      });

      playButton.addEventListener('click', () => {
        if (audioElement.paused) {
          audioElement.play();
          playIcon.style.display = 'none';
          pauseIcon.style.display = '';
          playButton.setAttribute('aria-pressed', 'true');
        } else {
          audioElement.pause();
          playIcon.style.display = '';
          pauseIcon.style.display = 'none';
          playButton.setAttribute('aria-pressed', 'false');
        }
      });

      audioElement.addEventListener('timeupdate', () => {
        const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
        progressSlider.value = progressPercent;
        currentTimeDisplay.textContent = this.formatTime(audioElement.currentTime);
        // console.log('Current time:', audioElement.currentTime, 'Progress:', progressPercent, '%');
      });

      progressSlider.addEventListener('input', () => {
        const seekTime = (progressSlider.value / 100) * audioElement.duration;
        audioElement.currentTime = seekTime;
        // console.log('Slider adjusted, seeking to:', seekTime);
      });
    }

    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }

  window.customElements.define('custom-audio', CustomAudio);
});
