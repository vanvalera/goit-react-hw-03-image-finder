const API_KEY = '35862645-57cfdba545019c0ba0c41aa5b';

function fetchImages(name, number) {
  return fetch(
    `https://pixabay.com/api/?q=${name}&page=${number}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  ).then(response => {
    return response.json();
  });
}

const imagesAPI = {
  fetchImages,
};

export default imagesAPI;
