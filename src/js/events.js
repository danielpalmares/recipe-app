export default function events() {
  const bodyEl = document.getElementsByTagName('body')[0];

  const listButton = document.querySelector('#header-list-button');
  const listCloseButton = document.querySelector('#nav-list-close-button');
  const navList = document.querySelector('.nav-list');

  const createRecipeButton = document.querySelector('#create-recipe-button');
  const uploadCloseButton = document.querySelector('#upload-close-button');
  const uploadWindow = document.querySelector('.upload-recipe-window');

  listButton.addEventListener('click', () => {
    navList.classList.remove('hidden');
    bodyEl.style.overflow = 'hidden';
  });

  listCloseButton.addEventListener('click', () => {
    navList.classList.add('hidden');
    bodyEl.style.overflow = 'visible';
  });

  createRecipeButton.addEventListener('click', () => {
    uploadWindow.classList.remove('hidden');
    bodyEl.style.overflow = 'hidden';
  });

  uploadCloseButton.addEventListener('click', () => {
    uploadWindow.classList.add('hidden');
    bodyEl.style.overflow = 'visible';
  });
}
