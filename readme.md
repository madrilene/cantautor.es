# cantautor.es

## Spotify Data Integration

This project integrates data from Spotify to dynamically display artist information. It involves a series of scripts that automate the fetching, processing, and preparation of this data.

### Scripts Overview

- **`spotify:generate`**: Fetches data from Spotify's API, including details about a specific playlist and its artists. Downloads assets such as artist images, album covers, and track previews.
- **`spotify:final`**: Processes the downloaded data to replace default assets with custom assets if available.
- **`spotify`**: Combines the above scripts to fetch and process data in one step.

### Workflow

1. **Fetch Spotify Data**: Authenticate with Spotify, retrieve playlist details, and download necessary assets into `src/assets/artists/`. Outputs to `artists-generated.json`.
2. **Process Data**: Read the generated JSON, check for custom assets in `src/assets/artists-custom/`, and produce a final `artists.json` with updated paths if custom assets exist.

### Usage

To run all Spotify integration scripts:

```bash
npm run spotify
```
