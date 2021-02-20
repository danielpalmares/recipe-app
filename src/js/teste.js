/* DOM EVENTS */
const listButton = document.querySelector('#header-list-button');
const listCloseButton = document.querySelector('#nav-list-close-button');

const createRecipeButton = document.querySelector('#create-recipe-button');
const uploadCloseButton = document.querySelector('#upload-close-button');

const navList = document.querySelector('.nav-list');
const navSection = document.querySelector('.nav-list-section');
const uploadWindow = document.querySelector('.upload-recipe-window');

const bodyEl = document.getElementsByTagName('body')[0];

listButton.addEventListener('click', () => {
  navList.style.display = 'block';
  navSection.style.display = 'flex';
  bodyEl.style.overflow = 'hidden';
});

listCloseButton.addEventListener('click', () => {
  navList.style.display = 'none';
  navSection.style.display = 'none';
  bodyEl.style.overflow = 'visible';
});

createRecipeButton.addEventListener('click', () => {
  uploadWindow.style.display = 'block';
  bodyEl.style.overflow = 'hidden';
});

uploadCloseButton.addEventListener('click', () => {
  uploadWindow.style.display = 'none';
  bodyEl.style.overflow = 'visible';
});
