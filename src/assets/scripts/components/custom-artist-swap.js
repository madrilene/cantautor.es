class CustomArtistSwap extends HTMLElement {
  constructor() {
    super();
    this.attachEventHandlers();
    this.artistOfTheDay = null;
    this.featuredArtistSlug = null;
    this.initiateLiveRegion();
  }

  connectedCallback() {
    const initialArtist = this.querySelector('[data-swap] > custom-artist[artist-of-the-day]');
    if (initialArtist) {
      this.artistOfTheDay = initialArtist.getAttribute('data-artist');
      this.featuredArtistSlug = this.artistOfTheDay;
    }
    this.appendSkipLinks();
  }

  appendSkipLinks() {
    const artists = this.querySelectorAll('.artistlist custom-artist');
    artists.forEach(artist => {
      const link = document.createElement('a');
      link.href = '#stage';
      link.className = 'skip-link';
      link.textContent = `Jump to featured artist ${this.formatArtistName(artist.getAttribute('data-artist'))}`;
      link.addEventListener('click', () => {
        const stageButton = this.querySelector('.stage .play-button');
        if (stageButton) {
          stageButton.focus();
        }
      });
      artist.appendChild(link);
    });
  }

  formatArtistName(name) {
    return name
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  }

  initiateLiveRegion() {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'assertive');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'visually-hidden');
    document.body.appendChild(this.liveRegion);
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
      const displayNewArtist = () => {
        this.directSwap(stage, artist);
        this.liveRegion.textContent = `${this.formatArtistName(artist.getAttribute('data-artist'))} is now featured on stage.`;
      };

      if (!document.startViewTransition) {
        displayNewArtist();
        return;
      }

      const transition = document.startViewTransition(() => displayNewArtist());
      transition.finished
        .then(() => console.log('Transition completed'))
        .catch(error => {
          console.error('Transition failed', error);
          displayNewArtist(); // Fallback to direct swap if transition fails
        });
    }
  }

  directSwap(stage, artist) {
    const currentlyStaged = document.querySelector('.artistlist [artist-staged]');
    if (currentlyStaged) {
      currentlyStaged.removeAttribute('artist-staged');
      currentlyStaged.querySelector('.arrow').setAttribute('aria-pressed', 'false');
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
  }
}

customElements.define('custom-artist-swap', CustomArtistSwap);
