class CustomArtistPlayer extends HTMLElement {
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
      // Clear current staged attribute in the list
      const currentlyStaged = document.querySelector('.artistlist [artist-staged]');
      if (currentlyStaged) {
        currentlyStaged.removeAttribute('artist-staged');
        currentlyStaged.removeAttribute('style');
      }

      const clonedArtist = artist.cloneNode(true);
      // Preserve the artist-of-the-day attribute if the artist is the artist of the day
      if (artist.getAttribute('data-artist') === this.artistOfTheDay) {
        clonedArtist.setAttribute('artist-of-the-day', '');
      }

      // Reset the featured artist slug and update the list
      this.featuredArtistSlug = artist.getAttribute('data-artist');
      artist.setAttribute('artist-staged', '');
      artist.removeAttribute('style'); // Ensure no styles are carried over

      // Clear the stage and insert the cloned artist without any residual styles
      stage.innerHTML = '';
      clonedArtist.style.removeProperty('margin-top');
      stage.appendChild(clonedArtist);
    }
  }
}

customElements.define('custom-artist-player', CustomArtistPlayer);
