import fs from 'node:fs';
import path from 'node:path';

const ensureDirectoryExists = dirPath => {
  if (fs.existsSync(dirPath)) {
    return;
  }
  ensureDirectoryExists(path.dirname(dirPath)); // Ensure parent directory exists
  fs.mkdirSync(dirPath);
};

export default ensureDirectoryExists;
