import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs';
import { PixabayAPI } from './pixabay-api';
import galleryCard from '../templates/gallery-cards.hbs';
import { lightbox } from './simpleLightBox';
import { smoothScroll, onToTopBtn } from './smoothScroll';

const pixabayApi = new PixabayAPI(20);

let totalPages = 0;

onToTopBtn();

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreData();
    }
  });
}, options);

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements['searchQuery'].value.trim();

  if (!query) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pixabayApi.q = query;
  pixabayApi.page = 1;
  try {
    const { totalHits, hits } = await pixabayApi.getPhotos();

    totalPages = Math.ceil(totalHits / 40);

    Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.list.innerHTML = galleryCard(hits);
    lightbox.refresh();

    if (totalPages === 1) {
      return;
    }
    observer.observe(refs.load);
  } catch (error) {
    Notify.failure(`${error}`);
  } finally {
    refs.form.reset();
  }
}

async function loadMoreData() {
  pixabayApi.page += 1;

  const { hits } = await pixabayApi.getPhotos();

  try {
    refs.list.insertAdjacentHTML('beforeend', galleryCard(hits));
    smoothScroll();
    lightbox.refresh();
    if (pixabayApi.page === totalPages) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      observer.unobserve(refs.load);
      return;
    }
  } catch {
    Notify.failure(`${error}`);
  }
}
