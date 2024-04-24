class CustomArtistSwap extends HTMLElement {
  constructor() {
    super();
    this.attachEventHandlers();
    this.artistOfTheDay = null;
    this.featuredArtistSlug = null;
  }

  connectedCallback() {
    // Initialize artist of the day on first load
    const initialArtist = this.querySelector('[data-swap] > custom-artist[artist-of-the-day]');
    if (initialArtist) {
      this.artistOfTheDay = initialArtist.getAttribute('data-artist');
      this.featuredArtistSlug = this.artistOfTheDay;
    }
  }

  attachEventHandlers() {
    const artistList = document.querySelector('.artistlist');
    artistList.addEventListener('click', event => {
      const targetArtist = event.target.closest('custom-artist');
      if (targetArtist) {
        this.swapFeaturedArtist(targetArtist);
      }
    });
  }

  swapFeaturedArtist(artist) {
    const stage = this.querySelector('[data-swap]');
    if (stage) {
      const displayNewArtist = () => {
        this.directSwap(stage, artist);
      };

      if (!document.startViewTransition) {
        displayNewArtist();
        return;
      }

      const transition = document.startViewTransition(() => displayNewArtist());
      transition.finished
        .then(() => {
          console.log('Transition completed');
        })
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
    }

    const clonedArtist = artist.cloneNode(true);
    clonedArtist.removeAttribute('style');

    if (artist.getAttribute('data-artist') === this.artistOfTheDay) {
      clonedArtist.setAttribute('artist-of-the-day', '');
    }

    this.featuredArtistSlug = artist.getAttribute('data-artist');
    artist.setAttribute('artist-staged', '');

    stage.innerHTML = '';
    stage.appendChild(clonedArtist);
  }
}

customElements.define('custom-artist-swap', CustomArtistSwap);
