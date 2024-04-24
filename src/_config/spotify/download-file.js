import fs from 'node:fs';
import fetch from 'node-fetch';
import {promisify} from 'node:util';

const downloadFile = async (url, filePath) => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  await promisify(fs.writeFile)(filePath, buffer);
};

export default downloadFile;
