require('dotenv').config();

const EleventyFetch = require('@11ty/eleventy-fetch');
const fetch = require('node-fetch');
const slugify = require('slugify');

const PLAYLIST = '22n4VI1DJuCp3Hh1Jzn9B6';
const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${PLAYLIST}`;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

module.exports = async function () {
  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET
    })
  };

  const accessToken = await fetch(TOKEN_ENDPOINT, options)
    .then(res => res.json())
    .then(json => json.access_token)
    .catch(console.error);

  const playlist = await EleventyFetch(PLAYLIST_ENDPOINT, {
    duration: '1h',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });

  const artistUrls = playlist?.tracks?.items?.reduce((urls, item) => {
    const artists = item?.track?.artists || [];
    const artistUrls = artists.map(artist => artist?.href).filter(Boolean);
    return urls.concat(artistUrls);
  }, []);

  const artistInfo = await Promise.all(
    artistUrls.map(async artistUrl => {
      const artistData = await EleventyFetch(artistUrl, {
        duration: '1h',
        type: 'json',
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      });
      return artistData;
    })
  );

  const playlistResponse = playlist?.tracks?.items || [];

  console.log('artist', artistInfo);

  return {
    playlist: playlistResponse,
    artistInfo: artistInfo
  };
};
