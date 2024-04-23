class CustomArtistPlayer extends HTMLElement {
  constructor() {
    super(); // Always call super first in constructor
    this.attachEventHandlers();
    this.artistOfTheDay = null; // To store the artist of the day data-artist value
    this.featuredArtistSlug = null; // Track the current featured artist
  }

  connectedCallback() {
    // Initialize artist of the day on first load
    const initialArtist = this.querySelector('[data-swap] > custom-artist[artist-of-the-day]');
    if (initialArtist) {
      this.artistOfTheDay = initialArtist.getAttribute('data-artist');
      this.featuredArtistSlug = this.artistOfTheDay; // Assume the initial artist is also currently staged
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
      }

      const clonedArtist = artist.cloneNode(true);
      // Preserve the artist-of-the-day attribute if the artist is the artist of the day
      if (artist.getAttribute('data-artist') === this.artistOfTheDay) {
        clonedArtist.setAttribute('artist-of-the-day', '');
      }

      this.featuredArtistSlug = artist.getAttribute('data-artist');
      artist.setAttribute('artist-staged', '');

      stage.innerHTML = '';
      stage.appendChild(clonedArtist);
    }
  }
}

customElements.define('custom-artist-player', CustomArtistPlayer);
