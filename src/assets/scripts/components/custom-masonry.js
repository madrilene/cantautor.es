class CustomMasonry extends HTMLElement {
  constructor() {
    super();
    this.layoutMasonry = this.layoutMasonry.bind(this);
    this.debounceLayout = this.debounceLayout.bind(this);
  }

  connectedCallback() {
    // Check if CSS Grid Masonry is supported
    if (!CSS.supports('grid-template-rows', 'masonry')) {
      // Defer initial layout to ensure styles are applied
      requestAnimationFrame(() => {
        this.layoutMasonry();
        window.addEventListener('resize', () => this.debounceLayout(100));
      });
    }
  }

  disconnectedCallback() {
    if (!CSS.supports('grid-template-rows', 'masonry')) {
      window.removeEventListener('resize', () => this.debounceLayout(100));
    }
  }

  debounceLayout(delay) {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.layoutMasonry, delay);
  }

  layoutMasonry() {
    const columnCount = getComputedStyle(this).gridTemplateColumns.split(' ').length;
    const items = Array.from(this.children);
    items.forEach((item, index) => {
      item.style.marginTop = '0px'; // Reset before calculation
      if (index >= columnCount) {
        const previousItem = items[index - columnCount];
        const previousItemBottom =
          previousItem.offsetTop + previousItem.offsetHeight + parseFloat(getComputedStyle(this).rowGap);
        const currentItemTop = item.offsetTop;
        const marginTop = previousItemBottom - currentItemTop;
        item.style.marginTop = `${marginTop}px`;
      }
    });
  }
}

customElements.define('custom-masonry', CustomMasonry);
