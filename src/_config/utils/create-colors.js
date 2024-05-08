import fs from 'node:fs';
import Color from 'colorjs.io';
import rgbHex from 'rgb-hex';

// ------------------ select a base color to generate the whole color palette
const baseColorHex = '#c33c00';
const baseColor = new Color(baseColorHex).to('lch');

// ------------------ create an array of primary 18 colors manipulating the hue of the base color
const generateHueVariations = (baseColor, steps, hueIncrement) => {
  let colors = [];
  for (let i = 0; i < steps; i++) {
    const hueAdjustedColor = baseColor.clone().set({h: h => (h + hueIncrement * i) % 360});
    colors.push(hueAdjustedColor);
  }
  return colors;
};

const colorVariations = generateHueVariations(baseColor, 18, 20);

// ------------------  randomly select the primary highlight color
const selectedColor = colorVariations[Math.floor(Math.random() * colorVariations.length)];
const colorObject = new Color(selectedColor);

// ------------------  create shades and highlights
const colorShades = {
  base: '#' + rgbHex(colorObject.to('srgb').toString()),
  dark:
    '#' +
    rgbHex(
      colorObject
        .clone()
        .set({l: l => l * 0.1, c: c => c * 0.05})
        .to('srgb')
        .toString()
    ),
  light:
    '#' +
    rgbHex(
      colorObject
        .clone()
        .set({l: l => l * 3.2, c: c => c * 0.15})
        .to('srgb')
        .toString()
    ),
  shade:
    '#' +
    rgbHex(
      colorObject
        .clone()
        .set({l: l => l * 0.8, c: c => c * 0.9})
        .to('srgb')
        .toString()
    ),
  glare:
    '#' +
    rgbHex(
      colorObject
        .clone()
        .set({l: l => l * 1.5, c: c => c * 0.5})
        .to('srgb')
        .toString()
    ),
  desaturate:
    '#' +
    rgbHex(
      colorObject
        .clone()
        .set({l: l => l * 0.8, c: c => c * 0.8})
        .to('srgb')
        .toString()
    )
};

// ------------------ Simulate the structure of the other token files for uniform processing
const colorTokens = {
  title: 'Colors',
  description: "Don't edit directly, this file is recreated on every build.",
  items: [
    {name: 'Primary Highlight', value: colorShades.base},
    {name: 'Primary Dark', value: colorShades.dark},
    {name: 'Primary Light', value: colorShades.light},
    {name: 'Primary Glare', value: colorShades.glare},
    {name: 'Primary Shade', value: colorShades.shade},
    {name: 'Primary Desaturated', value: colorShades.desaturate}
  ]
};

fs.writeFileSync(
  './src/_data/designTokens/colors.js',
  `export default ${JSON.stringify(colorTokens, null, 2)}`
);

// Export colorTokens as a module for Tailwind CSS
export default colorTokens;
