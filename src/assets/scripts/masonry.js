// Helper function to debounce another function
function debounce(func, wait) {
  let timeout;
  return function executedFunction() {
    const later = () => {
      clearTimeout(timeout);
      func();
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to apply masonry layout
function layoutGrids(grids) {
  grids.forEach(grid => {
    const ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;
    if (grid.ncol !== ncol) {
      grid.ncol = ncol;
      grid.items.forEach(c => c._el.style.removeProperty('margin-block-start'));
      if (grid.ncol > 1) {
        grid.items.slice(ncol).forEach((c, i) => {
          const prevFin = grid.items[i]._el.getBoundingClientRect().bottom;
          const currIni = c._el.getBoundingClientRect().top;
          c._el.style.marginTop = `${prevFin + grid.gap - currIni}px`;
        });
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const supportMasonry = CSS.supports('grid-template-rows', 'masonry');

  if (!supportMasonry) {
    const grids = [...document.querySelectorAll('.grid[data-rows="masonry"]')].map(grid => ({
      _el: grid,
      gap: parseFloat(getComputedStyle(grid).rowGap),
      items: [...grid.childNodes]
        .filter(c => c.nodeType === 1 && +getComputedStyle(c).gridColumnEnd !== -1)
        .map(c => ({_el: c})),
      ncol: 0
    }));

    // Layout function wrapped with debounce
    const debouncedLayout = debounce(() => layoutGrids(grids), 100);

    // Initial layout
    layoutGrids(grids);

    // Attach event listeners for load and resize
    window.addEventListener('load', debouncedLayout);
    window.addEventListener('resize', debouncedLayout);
  }
});
