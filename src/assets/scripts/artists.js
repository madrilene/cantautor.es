document.addEventListener('DOMContentLoaded', function () {
  const stage = document.querySelector('.stage');
  const artistlist = document.querySelector('.artistlist');
  let featuredArtistSlug = null; // To store the slug of the featured artist

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
      stopPlayingAudio(artist);
    }
    featuredArtistSlug = artist.getAttribute('data-artist');
    stage.innerHTML = '';
    stage.appendChild(artist.cloneNode(true));
    updateActiveArtistInList();
  }

  if (!featuredArtistSlug && artistlist.querySelector('custom-artist')) {
    moveToStage(artistlist.querySelector('custom-artist'));
  }

  artistlist.addEventListener('click', event => {
    const targetArtist = event.target.closest('custom-artist');
    if (targetArtist) {
      moveToStage(targetArtist);
    }
  });
});
