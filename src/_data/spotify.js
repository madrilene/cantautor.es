import dotenv from 'dotenv';
import EleventyFetch from '@11ty/eleventy-fetch';
import fetch from 'node-fetch';
import slugify from 'slugify';
import downloadFile from '../_config/utils/download-file.js';
import ensureDirectoryExists from '../_config/utils/ensure-directory-exists.js';
import fs from 'fs'; // Node.js File System module to check file existence

dotenv.config();

const PLAYLIST = '22n4VI1DJuCp3Hh1Jzn9B6';
const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${PLAYLIST}`;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

async function fetchPlaylist() {
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString(
    'base64'
  );
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  };

  const accessToken = await fetch(TOKEN_ENDPOINT, options)
    .then(res => res.json())
    .then(json => json.access_token)
    .catch(error => {
      console.error('Failed to fetch access token:', error);
      throw new Error('Access Token Fetch Failed');
    });

  const playlist = await EleventyFetch(PLAYLIST_ENDPOINT, {
    duration: '1h',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });

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

      const customProfilePath = `${artistDir}/profile-custom.jpg`;
      const defaultProfilePath = `${artistDir}/profile.jpg`;

      // Check for a custom profile image first
      let profileImagePath = fs.existsSync(customProfilePath) ? customProfilePath : defaultProfilePath;

      const tasks = [];
      // Only download if no custom profile image exists and there are images available
      if (!fs.existsSync(profileImagePath) && artistDetails.images && artistDetails.images.length > 0) {
        const imageUrl = artistDetails.images[0].url;
        tasks.push(downloadFile(imageUrl, defaultProfilePath));
        profileImagePath = defaultProfilePath; // Update path if we're downloading the new image
      }

      if (track.track.album && track.track.album.images && track.track.album.images.length > 0) {
        const albumImageUrl = track.track.album.images[0].url;
        const albumImagePath = `${artistDir}/album.jpg`;
        if (!fs.existsSync(albumImagePath)) {
          tasks.push(downloadFile(albumImageUrl, albumImagePath));
        }
      }

      if (track.track.preview_url && !fs.existsSync(`${artistDir}/preview.mp3`)) {
        const previewMp3Path = `${artistDir}/preview.mp3`;
        tasks.push(downloadFile(track.track.preview_url, previewMp3Path));
      }

      await Promise.all(tasks);

      artists.push({
        name: artist.name,
        profileImage: profileImagePath.replace('./src', ''), // Adjust path for use in web context
        albumImage: `/assets/artists/${slug}/album.jpg`,
        albumName: track.track.album ? track.track.album.name : 'Unknown Album',
        preview: `/assets/artists/${slug}/preview.mp3`,
        spotifyUrl: artist.external_urls.spotify
      });
    }
  }

  return {artists};
}

export default fetchPlaylist;
