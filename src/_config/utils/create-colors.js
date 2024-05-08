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
const selectedBase = colorObject.to('srgb').toString();
const selectedDark = colorObject
  .clone()
  .set({l: l => l * 0.1, c: c => c * 0.05})
  .to('srgb')
  .toString();
const selectedLight = colorObject
  .clone()
  .set({l: l => l * 3.2, c: c => c * 0.15})
  .to('srgb')
  .toString();
const selectedGlare = colorObject
  .clone()
  .set({l: l => l * 1.5, c: c => c * 0.5})
  .to('srgb')
  .toString();
const selectedDesaturate = colorObject
  .clone()
  .set({c: c => c * 0.8})
  .to('srgb')
  .toString();

// ------------------ Simulate the structure of the other token files for uniform processing
const colorTokens = [
  {name: 'Primary Highlight', value: '#' + rgbHex(selectedBase)},
  {name: 'Primary Dark', value: '#' + rgbHex(selectedDark)},
  {name: 'Primary Light', value: '#' + rgbHex(selectedLight)},
  {name: 'Primary Glare', value: '#' + rgbHex(selectedGlare)},
  {name: 'Primary Desaturated', value: '#' + rgbHex(selectedDesaturate)}
];

// ------------------ get a json file with the color tokens
const jsonContent = {
  title: 'Colors',
  items: colorTokens
};

fs.writeFileSync('./src/_data/designTokens/colors.json', JSON.stringify(jsonContent, null, 2));
