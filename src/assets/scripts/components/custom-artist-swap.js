class CustomArtistSwap extends HTMLElement {
  constructor() {
    super();
    this.attachEventHandlers();
    this.artistOfTheDay = null;
    this.featuredArtistSlug = null;
    this.initiateLiveRegion();
  }

  connectedCallback() {
    const initialArtistElement = this.querySelector('[data-swap] > custom-artist[artist-of-the-day]');
    if (initialArtistElement) {
      this.artistOfTheDay = initialArtistElement.getAttribute('data-artist');
      this.featuredArtistSlug = this.artistOfTheDay;
    }

    // Inject the artist of the day into the live region after a short delay
    setTimeout(() => {
      this.updateLiveRegion(`${this.formatArtistName(this.artistOfTheDay)} is the artist of the day.`);
    }, 1000); // 1000ms delay
  }

  formatArtistName(name) {
    return name
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  }

  initiateLiveRegion() {
    this.newLiveRegion = document.createElement('div');
    this.newLiveRegion.setAttribute('aria-live', 'polite');
    this.newLiveRegion.setAttribute('id', 'live-region');
    this.newLiveRegion.setAttribute('class', 'visually-hidden');
    document.body.appendChild(this.newLiveRegion);
  }

  updateLiveRegion(message) {
    const liveRegion = document.getElementById('live-region');
    while (liveRegion.firstChild) {
      liveRegion.removeChild(liveRegion.firstChild);
    }
    const newMessage = document.createTextNode(message);
    liveRegion.appendChild(newMessage);
  }

  attachEventHandlers() {
    const artistList = document.querySelector('.artistlist');
    artistList.addEventListener('click', event => {
      const targetArtist = event.target.closest('custom-artist');
      if (targetArtist && targetArtist !== event.currentTarget) {
        event.preventDefault();
        this.swapFeaturedArtist(targetArtist);
      }
    });
  }

  swapFeaturedArtist(artist) {
    const stage = this.querySelector('[data-swap]');
    if (stage) {
      const showNewArtistOnStage = () => {
        this.directSwap(stage, artist);
        this.updateLiveRegion(
          `${this.formatArtistName(artist.getAttribute('data-artist'))} is now featured on stage.`
        );
      };

      if (!document.startViewTransition) {
        showNewArtistOnStage();
        return;
      }

      const transition = document.startViewTransition(() => showNewArtistOnStage());
      transition.finished
        .then(() => {
          console.log('Transition completed');
        })
        .catch(error => {
          console.error('Transition failed', error);
          showNewArtistOnStage(); // Fallback to direct swap if transition fails
        });
    }
  }

  directSwap(stage, artist) {
    const currentlyStaged = document.querySelector('.artistlist [artist-staged]');
    if (currentlyStaged) {
      currentlyStaged.removeAttribute('artist-staged');
      currentlyStaged.querySelector('.arrow').setAttribute('aria-pressed', 'false');
    }

    // Remove existing skip link if there
    const existingSkipLink = stage.querySelector('.skip-link');
    if (existingSkipLink) {
      existingSkipLink.remove();
    }

    const clonedArtist = artist.cloneNode(true);
    clonedArtist.removeAttribute('style');

    if (artist.getAttribute('data-artist') === this.artistOfTheDay) {
      clonedArtist.setAttribute('artist-of-the-day', '');
    }

    this.featuredArtistSlug = artist.getAttribute('data-artist');
    artist.setAttribute('artist-staged', 'true');
    artist.querySelector('.arrow').setAttribute('aria-pressed', 'true');

    stage.innerHTML = '';
    stage.appendChild(clonedArtist);

    // Focus the play button directly
    const playButton = clonedArtist.querySelector('.play-button');
    if (playButton) {
      playButton.focus();
    }
  }
}

customElements.define('custom-artist-swap', CustomArtistSwap);
