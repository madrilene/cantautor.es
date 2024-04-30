document.addEventListener('DOMContentLoaded', function () {
  const supportMasonry = CSS.supports('grid-template-rows', 'masonry');

  if (!supportMasonry) {
    const grid = document.querySelector('.grid[data-rows="masonry"]');
    const allItems = grid.querySelectorAll('.item');

    function resizeGridItem(item) {
      const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'), 10);
      const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'), 10);
      const itemHeight = item.getBoundingClientRect().height;
      const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));

      item.style.gridRowEnd = 'span ' + rowSpan;
    }

    function resizeAllGridItems() {
      allItems.forEach(item => resizeGridItem(item));
    }

    // Trigger initial resize
    resizeAllGridItems();

    // Attach resize event listener to window
    window.addEventListener('resize', resizeAllGridItems);
  }
});
