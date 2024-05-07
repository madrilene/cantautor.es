/**
 * Credits:
 * - © Andy Bell - https://buildexcellentwebsit.es/
 */

/**
 * Converts human readable tokens into tailwind config friendly ones
 *
 * @param {array} tokens {name: string, value: any}
 * @return {object} {key, value}
 */

import slugify from 'slugify';

// Your existing universal token transformation function
export const tokensToTailwind = tokens => {
  const nameSlug = text => slugify(text, {lower: true});
  let response = {};

  tokens.forEach(({name, value}) => {
    response[nameSlug(name)] = value;
  });

  return response;
};

// Function to preprocess tokens, specifically handling random selection for "Primary Highlight"
export const preprocessTokens = tokens => {
  return tokens.map(token => {
    if (token.name === 'Primary Highlight' && Array.isArray(token.value)) {
      const randomIndex = Math.floor(Math.random() * token.value.length);
      return {...token, value: token.value[randomIndex]}; // Replace the array with a single randomly selected color
    }
    return token;
  });
};
