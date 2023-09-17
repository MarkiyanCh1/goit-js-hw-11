import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/';
  #END_POINT = 'api/';
  #API_KEY = '39500807-1603edb463da9917dec90ef2b';

  constructor(perPage) {
    this.per_page = perPage;
    this.page = 1;
    this.q = '';
  }

  async getPhotos() {
    const options = {
      params: {
        key: this.#API_KEY,
        q: this.q,
        page: this.page,
        per_page: this.per_page,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
      },
    };
    const resp = await axios.get(
      `${this.#BASE_URL}${this.#END_POINT}`,
      options
    );
    return resp.data;
  }
}