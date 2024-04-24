import slugify from 'slugify';
import fs from 'node:fs';
import path from 'node:path';

const generatedArtistsPath = './src/_data/artists-generated.json';
const finalArtistsPath = './src/_data/artists.json';
const customAssetsDir = './src/assets/artists-custom/';

function updateArtistsWithCustomAssets() {
  if (!fs.existsSync(generatedArtistsPath)) {
    console.error('No artists data file found.');
    return;
  }

  const artists = JSON.parse(fs.readFileSync(generatedArtistsPath, 'utf-8'));
  const updatedArtists = artists.map(artist => {
    const slug = slugify(artist.name, {lower: true}); // Ensure slug is generated or make sure it is already included in the artist object
    const customDirPath = path.join(customAssetsDir, slug);

    const profileCustomPath = path.join(customDirPath, 'profile.jpg');
    const albumCustomPath = path.join(customDirPath, 'album.jpg');
    const previewCustomPath = path.join(customDirPath, 'preview.mp3');

    // Update profile image if a custom one exists and is different from the generated one
    if (fs.existsSync(profileCustomPath)) {
      artist.profileImage = profileCustomPath.replace('src', '');
    }

    // Update album image if a custom one exists
    if (fs.existsSync(albumCustomPath)) {
      artist.albumImage = albumCustomPath.replace('src', '');
    }

    // Update preview if a custom one exists
    if (fs.existsSync(previewCustomPath)) {
      artist.preview = previewCustomPath.replace('src', '');
    }

    return artist;
  });

  // Save the updated artists data
  fs.writeFileSync(finalArtistsPath, JSON.stringify(updatedArtists, null, 2));
  console.log('Final artists data updated with custom assets.');
}

updateArtistsWithCustomAssets();
