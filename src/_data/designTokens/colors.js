import Color from 'colorjs.io';

// old manual array
// const primaryColors = ['#c33c00', '#007c3c', '#00787b', '#3d66cc', '#9245cd', '#c8059d', '#ca2d41'];

// ------------------ select a base color to generate the whole color palette
const baseColorHex = '#c33c00';
const baseColor = new Color(baseColorHex).to('lch');

// ------------------ create an array of primary 18 colors manipulating the hue of the base color
const generateHueVariations = (baseColor, steps, hueIncrement) => {
  let colors = [];
  for (let i = 0; i < steps; i++) {
    const hueAdjustedColor = baseColor
      .clone()
      .set({h: h => (h + hueIncrement * i) % 360})
      .toString();
    colors.push(hueAdjustedColor);
  }
  return colors;
};

const colorVariations = generateHueVariations(baseColor, 18, 20);

// ------------------  randomly select the primary highlight color
const selectedColor = colorVariations[Math.floor(Math.random() * colorVariations.length)];
const colorObject = new Color(selectedColor);

const selectedRgb = colorObject.to('srgb').toString();

// ------------------  create shades and highlights
const selectedBase = colorObject.toString();
const selectedDark = colorObject
  .clone()
  .set({l: l => l * 0.1, c: c => c * 0.05})
  .toString();
const selectedLight = colorObject
  .clone()
  .set({l: l => l * 3.2, c: c => c * 0.15})
  .toString();
const selectedGlare = colorObject
  .clone()
  .set({l: l => l * 1.5, c: c => c * 0.5})
  .toString();
const selectedDesaturate = colorObject
  .clone()
  .set({c: c => c * 0.8})
  .toString();

// ------------------ Simulate the structure of the other token files for uniform processing
const colorTokens = {
  items: [
    {name: 'Primary Highlight', value: selectedBase},
    {name: 'Primary Dark', value: selectedDark},
    {name: 'Primary Light', value: selectedLight},
    {name: 'Primary Glare', value: selectedGlare},
    {name: 'Primary Desaturated', value: selectedDesaturate}
  ]
};

console.log(colorTokens, selectedColor, selectedRgb);

export {colorTokens, selectedColor, selectedRgb};
