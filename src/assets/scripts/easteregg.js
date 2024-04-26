const codes = [
  {name: 'cantautor', code: ['c', 'a', 'n', 't', 'a', 'u', 't', 'o', 'r']},
  {name: 'lene', code: ['l', 'e', 'n', 'e']},
  {name: 'dani', code: ['d', 'a', 'n', 'i']}
];

let indexes = {};

codes.forEach(code => {
  indexes[code.name] = 0;
});

document.addEventListener('keydown', event => {
  codes.forEach(code => {
    if (code.code[indexes[code.name]] === event.key.toLowerCase()) {
      ++indexes[code.name];
    } else {
      indexes[code.name] = 0;
    }
  });

  const codeEntered = codes.find(code => indexes[code.name] === code.code.length);

  if (codeEntered) {
    console.log('Hooray! Secret code entered!');
    indexes = {};

    import('https://esm.run/canvas-confetti').then(module => {
      var defaults = {
        spread: 260,
        colors: ['e84700', 'D31400']
      };

      const confetti = module.default;
      const scalar = 4;
      const particleCount = 70;

      confetti({
        ...defaults,
        scalar,
        particleCount
      });
    });
  }
});
