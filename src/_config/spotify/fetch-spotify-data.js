import dotenv from 'dotenv';
import fetch from 'node-fetch';
import slugify from 'slugify';
import downloadFile from './download-file.js';
import ensureDirectoryExists from './ensure-directory-exists.js';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const PLAYLIST = '22n4VI1DJuCp3Hh1Jzn9B6';
const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${PLAYLIST}`;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

async function fetchSpotifyData() {
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString(
    'base64'
  );
  const accessTokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });
  const accessToken = await accessTokenResponse.json().then(data => data.access_token);

  const playlistResponse = await fetch(PLAYLIST_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const playlist = await playlistResponse.json();

  let artists = [];

  for (let track of playlist.tracks.items) {
    for (let artist of track.track.artists) {
      const artistDetailsResponse = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
      });
      const artistDetails = await artistDetailsResponse.json();

      const slug = slugify(artist.name, {lower: true});
      const artistDir = `./src/assets/artists/${slug}`;
      ensureDirectoryExists(artistDir);

      const profileImagePath = `${artistDir}/profile.jpg`;
      if (artistDetails.images && artistDetails.images.length > 0) {
        const imageUrl = artistDetails.images[0].url;
        await downloadFile(imageUrl, profileImagePath, true); // true to force download
      }

      const albumImagePath = `${artistDir}/album.jpg`;
      if (track.track.album && track.track.album.images && track.track.album.images.length > 0) {
        const albumImageUrl = track.track.album.images[0].url;
        await downloadFile(albumImageUrl, albumImagePath, true); // true to force download
      }

      const previewMp3Path = `${artistDir}/preview.mp3`;
      if (track.track.preview_url) {
        await downloadFile(track.track.preview_url, previewMp3Path, true); // true to force download
      }

      artists.push({
        name: artist.name,
        trackName: track.track.name,
        profileImage: profileImagePath.replace('./src', ''),
        albumImage: `/assets/artists/${slug}/album.jpg`,
        albumName: track.track.album ? track.track.album.name : 'Unknown Album',
        preview: `/assets/artists/${slug}/preview.mp3`,
        spotifyUrl: artist.external_urls.spotify
      });
    }
  }

  // Save to a local JSON file for caching and easier access during development
  console.log('Spotify data updated successfully.');
  fs.writeFileSync('./src/_data/artists-generated.json', JSON.stringify(artists, null, 2));
}

fetchSpotifyData();
