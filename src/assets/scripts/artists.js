document.addEventListener('DOMContentLoaded', function () {
  const stage = document.querySelector('.stage');
  const artistlist = document.querySelector('.artistlist');
  let featuredArtistSlug = null; // To store the slug of the featured artist
  let artistOfTheDaySlug = null; // Store the slug of the artist of the day

  // Determine and mark the artist of the day
  const artistOfTheDay = stage.querySelector('custom-artist[artist-of-the-day]');
  if (artistOfTheDay) {
    artistOfTheDaySlug = artistOfTheDay.getAttribute('data-artist');
    featuredArtistSlug = artistOfTheDaySlug; // Assume the initial artist is the featured artist
  }

  function stopPlayingAudio(artist) {
    const audio = artist.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset the audio playback to start
    }
  }

  function updateActiveArtistInList() {
    document.querySelectorAll('.artistlist custom-artist[active-artist]').forEach(artist => {
      artist.removeAttribute('active-artist');
    });

    if (featuredArtistSlug) {
      const activeArtist = artistlist.querySelector(`custom-artist[data-artist="${featuredArtistSlug}"]`);
      if (activeArtist) {
        activeArtist.setAttribute('active-artist', '');
      }
    }
  }

  function moveToStage(artist) {
    if (featuredArtistSlug) {
      stopPlayingAudio(stage.querySelector('custom-artist'));
    }
    featuredArtistSlug = artist.getAttribute('data-artist');
    const clonedArtist = artist.cloneNode(true);

    // Check if the moved artist is the artist of the day
    if (artistOfTheDaySlug === featuredArtistSlug) {
      clonedArtist.setAttribute('artist-of-the-day', '');
    }

    // Only update the stage if a different artist is selected
    if (featuredArtistSlug !== artistOfTheDaySlug || !artistOfTheDay) {
      stage.innerHTML = '';
      stage.appendChild(clonedArtist);
    }
    updateActiveArtistInList();
  }

  artistlist.addEventListener('click', event => {
    const targetArtist = event.target.closest('custom-artist');
    if (targetArtist && targetArtist.getAttribute('data-artist') !== featuredArtistSlug) {
      moveToStage(targetArtist);
    }
  });

  // Set the featured artist if not already set by Nunjucks
  if (!artistOfTheDay) {
    const initialArtist = artistlist.querySelector('custom-artist');
    if (initialArtist) {
      moveToStage(initialArtist);
    }
  }
});
