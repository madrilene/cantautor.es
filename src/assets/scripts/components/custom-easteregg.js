class customEasteregg extends HTMLElement {
  constructor() {
    super();
    // Set default keywords
    this.keywords = ['cantautor', 'lene', 'dani'];
    // get first name of current artist
    const customKeyword = this.getAttribute('keyword');
    if (customKeyword) {
      const keywordArray = customKeyword.split('-');
      const firstName = keywordArray[0].toString();
      this.keywords.push(firstName);
    }
    // get current primary color, or fallback to orange
    this.colors = this.getAttribute('colors')
      ? this.getAttribute('colors').split(',')
      : ['#e84700', '#D31400'];
    this.particleCount = parseInt(this.getAttribute('particle-count'), 10) || 70;
    this.codes = this.keywords.map(keyword => keyword.split(''));
    this.indexes = new Array(this.keywords.length).fill(0);
  }

  connectedCallback() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(event) {
    const key = event.key.toLowerCase();
    this.codes.forEach((code, idx) => {
      if (code[this.indexes[idx]] === key) {
        this.indexes[idx]++;
        if (this.indexes[idx] === code.length) {
          this.triggerEffect(this.keywords[idx]);
          this.indexes[idx] = 0; // Reset index after triggering
        }
      } else {
        this.indexes[idx] = 0; // Reset index if sequence breaks
      }
    });
  }

  triggerEffect(keyword) {
    console.log(`Hooray ${keyword}!`);
    import('https://esm.run/canvas-confetti').then(({default: confetti}) => {
      confetti({
        spread: 260,
        scalar: 4,
        colors: this.colors,
        particleCount: this.particleCount
      });
    });
  }
}

customElements.define('custom-easteregg', customEasteregg);
