import { Notify } from 'notiflix';
import { createFetsh } from './fetch';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
const form = document.querySelector('#search-form');
const input = form.elements.searchQuery;
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let galleryLightbox = new SimpleLightbox('.gallery a');

let page = 0;
let limit = 0;
const perPage = 40;
loadMore.classList.add('visually-hidden');

form.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);

function onLoadMore(event) {
  event.preventDefault();
  page += 1;
  createGallery(page);
}

function onSearch(event) {
  page = 1;
  limit = 1;
  event.preventDefault();
  gallery.innerHTML = '';
  loadMore.classList.add('visually-hidden');
  if (!input.value.trim()) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  createGallery(page);
}

async function createGallery(page) {
  try {
    const data = await createFetsh(input.value.trim(), page, perPage);
    limit = data.totalHits / perPage;
    if (!data.totalHits) {
      loadMore.classList.add('visually-hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (page === 1) Notify.info(`Hooray! We found ${data.totalHits} images.`);
    if (page > limit) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return loadMore.classList.add('visually-hidden');
    }
    renderMurkup(data.hits);
    galleryLightbox.refresh();
    loadMore.classList.remove('visually-hidden');
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function renderMurkup(arr) {
  let murkup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${webformatURL}"><img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
        <p class="info-item"><b>Likes<br>${likes}</b></p>
        <p class="info-item"><b>Views<br>${views}</b></p>
        <p class="info-item"><b>Comments<br>${downloads}</b></p>
        <p class="info-item"><b>Downloads<br>${comments}</b></p></div>
        </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', murkup);
}
