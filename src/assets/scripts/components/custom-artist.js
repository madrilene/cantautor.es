class CustomArtist extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
    this.featuredArtistSlug = null;
  }

  connectedCallback() {
    this.initializeEvents();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }
        .artist-list {
          display: flex;
          flex-direction: column;
        }
        .active {
          background-color: lightblue;
        }
        .play-button, .pause-button {
          cursor: pointer;
        }
        .pause-button {
          display: none;
        }
        .progress-filled {
          height: 5px;
          background: blue;
          width: 0%;
        }
      </style>
      <div class="stage"></div>
      <div class="artist-list"></div>
    `;
  }

  initializeEvents() {
    const artistList = this.shadowRoot.querySelector('.artist-list');
    artistList.addEventListener('click', event => {
      const artist = event.target.closest('custom-artist');
      if (artist) {
        this.moveToStage(artist);
      }
    });
  }

  moveToStage(artist) {
    const stage = this.shadowRoot.querySelector('.stage');
    this.stopPlayingAudio(stage.querySelector('custom-artist'));
    this.featuredArtistSlug = artist.dataset.artist;
    const clonedArtist = artist.cloneNode(true);
    this.attachAudioEvents(clonedArtist);
    stage.innerHTML = '';
    stage.appendChild(clonedArtist);
    this.updateActiveArtistInList();
  }

  stopPlayingAudio(artist) {
    if (artist) {
      const audio = artist.querySelector('audio');
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }

  updateActiveArtistInList() {
    const artists = this.shadowRoot.querySelectorAll('.artist-list custom-artist');
    artists.forEach(artist => {
      artist.classList.remove('active');
      if (artist.dataset.artist === this.featuredArtistSlug) {
        artist.classList.add('active');
      }
    });
  }

  attachAudioEvents(artistElement) {
    const audioElement = artistElement.querySelector('audio');
    const playButton = artistElement.querySelector('.play-button');
    const pauseButton = artistElement.querySelector('.pause-button');
    const progressFilled = artistElement.querySelector('.progress-filled');

    playButton.onclick = () => {
      audioElement.play();
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
    };

    pauseButton.onclick = () => {
      audioElement.pause();
      playButton.style.display = 'block';
      pauseButton.style.display = 'none';
    };

    audioElement.ontimeupdate = () => {
      const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
      progressFilled.style.width = `${progressPercent}%`;
    };
  }
}

window.customElements.define('custom-artist', custom - artist);
