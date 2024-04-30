// based on CSS Grid Masonry by Andy Barefoot: https://codepen.io/andybarefoot/pen/QMeZda

document.addEventListener('DOMContentLoaded', function () {
  function resizeGridItem(item) {
    const grid = document.querySelector('.grid[data-rows="masonry"]');
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'), 10);
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'), 10);
    const itemHeight = item.getBoundingClientRect().height; // Use the height of the item directly
    const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));

    item.style.gridRowEnd = 'span ' + rowSpan;
  }

  function resizeAllGridItems() {
    const allItems = document.querySelectorAll('.item');
    allItems.forEach(item => resizeGridItem(item));
  }

  // Trigger initial resize
  resizeAllGridItems();

  // Attach resize event listener to window
  window.addEventListener('resize', resizeAllGridItems);
});
