// import './css/styles.css';

import { Notify } from 'notiflix';
import axios from 'axios';
const form = document.querySelector('#search-form');
const input = form.elements.searchQuery;
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
loadMore.classList.add('visually-hidden');

let page;
let limit;
const perPage = 40;
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

  createGallery(page);
  // form.reset();
}
function createGallery(page) {
  createFetsh(input.value, page, perPage)
    .then(data => {
      totalHits = data.totalHits;
      limit = totalHits / perPage;
      if (totalHits) {
        if (page === 1) {
          Notify.info(`Hooray! We found ${totalHits} images.`);
        }
        console.log(page);
        console.log(limit);
        if (page > limit) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          return loadMore.classList.add('visually-hidden');
        }

        renderMurkup(data.hits);
        loadMore.classList.remove('visually-hidden');
      } else {
        console.log('totalHits', totalHits);
        loadMore.classList.add('visually-hidden');
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

function renderMurkup(arr) {
  gallery.innerHTML = arr
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
        return `<div class="photo-card"><a href="${webformatURL}"> 
        <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
        <p class="info-item"><b>Likes  ${likes}</b></p>
        <p class="info-item"><b>Views ${views}</b></p>
        <p class="info-item"><b>Comments ${downloads}</b></p>
        <p class="info-item"><b>Downloads ${comments}</b></p></div>
        </div>`;
      }
    )
    .join('');

  //   webformatURL - ссылка на маленькое изображение для списка карточек.
  // largeImageURL - ссылка на большое изображение.
}

async function createFetsh(value, page, perPage) {
  const resp = await axios.get(
    `https://pixabay.com/api/?key=32867517-775a58f450fa05e0fc64e3e7e&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  console.log('resp.data', resp.data);
  return await resp.data;
}
