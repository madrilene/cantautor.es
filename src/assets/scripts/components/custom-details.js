const expandAllButton = document.querySelector('#expandAll');
const collapseAllButton = document.querySelector('#collapseAll');
const details = document.querySelectorAll('details');

expandAllButton.addEventListener('click', () => {
  details.forEach(detail => (detail.open = true));
});

collapseAllButton.addEventListener('click', () => {
  details.forEach(detail => (detail.open = false));
});

details.forEach(detail => {
  detail.addEventListener('toggle', () => {
    const hash = detail.open ? `#${detail.id}` : '#';
    history.pushState(null, null, hash);
  });
});

const id = window.location.hash.slice(1);
const detail = document.getElementById(id);
if (detail) detail.open = true;
