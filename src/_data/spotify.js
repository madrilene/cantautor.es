const EleventyFetch = require('@11ty/eleventy-fetch');

// auth

const SPOTIFY_CLIENT_TOKEN = require('#datajs/spotify_token');
console.log(SPOTIFY_CLIENT_TOKEN);

module.exports = async function () {
  const playlist = '3cEYpjA9oz9GiPac4AsH4n';
  const url = `https://api.spotify.com/v1/playlists/${playlist}`;
  const res = await EleventyFetch(url, {
    duration: '1h',
    directory: '.cache/eleventy-fetch/',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${SPOTIFY_CLIENT_TOKEN()}`
      }
    }
  }).catch();
  const data = await res;
  return data;
};

res;
