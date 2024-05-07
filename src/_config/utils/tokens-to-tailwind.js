/**
 *  * Credits:
 * - © Andy Bell - https://buildexcellentwebsit.es/
 * Converts human readable tokens into tailwind config friendly ones
 *
 * @param {array} tokens {name: string, value: any}
 * @return {object} {key, value}
 */

import slugify from 'slugify';

export const tokensToTailwind = tokens => {
  const nameSlug = text => slugify(text, {lower: true});
  let response = {};

  tokens.forEach(({name, value}) => {
    response[nameSlug(name)] = value;
  });

  return response;
};

/**
 * Preprocesses tokens, selecting a random color from the array for the special case of 'Primary Highlight' token
 *
 * @param {array} tokens - An array of tokens with properties `name` (string) and `value` (any)
 * @return {array} - An array of tokens with the 'Primary Highlight' token value randomly selected from the array
 */

export const preprocessTokens = tokens => {
  return tokens.map(token => {
    if (token.name === 'Primary Highlight' && Array.isArray(token.value)) {
      const randomIndex = Math.floor(Math.random() * token.value.length);
      return {...token, value: token.value[randomIndex]};
    }
    return token;
  });
};
