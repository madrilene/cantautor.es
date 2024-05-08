import fs from 'fs';
import sharp from 'sharp';
import Jimp from 'jimp';
import colorTokens from '../../_data/designTokens/colors.js';

const primaryColor = colorTokens.items[0].value;

export const createFavicons = async function () {
  const outputDir = 'src/assets/images/favicons';
  // Ensure the directory exists
  fs.mkdirSync(outputDir, {recursive: true});

  // ------------------ define base SVG
  const svgContent = `
		<svg xmlns="http://www.w3.org/2000/svg" width="33.51" height="33.508" viewBox="0 0 33.51 33.508">
		<g transform="translate(1.307 1.315)">
			<path
				fill="${primaryColor}"
				stroke="${primaryColor}"
				stroke-width="2px"
				d="M15.448,0l2.265,1.935L20.481.843,22,3.411l2.972-.131.6,2.923,2.853.844-.375,2.961,2.425,1.728-1.313,2.678L30.9,16.838l-2.108,2.105.856,2.858-2.675,1.3-.115,2.982L23.9,26.45l-1.074,2.783-2.91-.62L18,30.9l-2.551-1.534L12.9,30.9,10.98,28.614l-2.91.62L7,26.45l-2.952-.362-.115-2.982L1.253,21.8l.856-2.858L0,16.838l1.734-2.425L.421,11.736l2.425-1.728L2.471,7.047,5.324,6.2l.6-2.923L8.9,3.411,10.415.843l2.768,1.092Z"
			/>
			<path
				fill="#fff"
				d="M3.976,17.891a3.828,3.828,0,0,1-2.808-1.168,3.959,3.959,0,0,1,0-5.616A3.829,3.829,0,0,1,3.976,9.94a3.877,3.877,0,0,1,1.056.137,3.712,3.712,0,0,1,.932.41V0h5.964V2.162H7.952V13.916a3.828,3.828,0,0,1-1.168,2.808A3.828,3.828,0,0,1,3.976,17.891Z"
				transform="matrix(0.966, 0.259, -0.259, 0.966, 13.244, 5.264)"
			/>
		</g>
	</svg>
	`;

  const svgBuffer = Buffer.from(svgContent);

  // ------------------ Save original SVG
  fs.writeFileSync(`${outputDir}/favicon.svg`, svgBuffer);

  // ------------------ Generate PNGs
  await sharp(svgBuffer).resize(192, 192).toFile(`${outputDir}/icon-192x192.png`);
  await sharp(svgBuffer).resize(512, 512).toFile(`${outputDir}/icon-512x512.png`);
  await sharp(svgBuffer).resize(180, 180).toFile(`${outputDir}/icon-180x180.png`);

  // Generate maskable icon with padding
  const maskableSize = 512;
  const padding = Math.round(maskableSize * 0.1);
  const newSize = Math.round(maskableSize - 2 * padding); // Ensure newSize is a whole number
  await sharp(svgBuffer)
    .resize(newSize, newSize) // Resize to new size considering padding
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: {r: 0, g: 0, b: 0, alpha: 0} // Transparent padding
    })
    .toFile(`${outputDir}/maskable-512x512.png`);

  // Generate ICO
  const pngBuffer = await sharp(Buffer.from(svgContent)).resize(32, 32).png().toBuffer();
  const image = await Jimp.read(pngBuffer);
  await image.writeAsync(`${outputDir}/favicon.ico`);
};
